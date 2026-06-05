import { BleManager } from "react-native-ble-plx";
import { Platform, PermissionsAndroid } from "react-native";
import { Buffer } from "buffer";

// ─── BedJet V3 BLE Protocol (verified against ESPHome source) ────────────────
//
// Service:         00001000-bed0-0080-aa55-4265644a6574
// Status (notify): 00002000-bed0-0080-aa55-4265644a6574
// Command (write): 00002003-bed0-0080-aa55-4265644a6574
//
// COMMAND PACKET FORMAT: 3 bytes [command_opcode, data, 0x00]
//
//   CMD_BUTTON   = 0x01  →  [0x01, button_byte, 0x00]
//   CMD_SET_TEMP = 0x03  →  [0x03, temp_step,   0x00]   temp_step = round(tempC * 2)
//   CMD_SET_FAN  = 0x07  →  [0x07, fan_step,    0x00]   fan_step  = (fan% / 5) - 1  (0-19)
//
// Button bytes:
//   BTN_OFF   = 0x01, BTN_COOL = 0x02, BTN_HEAT = 0x03
//   BTN_TURBO = 0x04, BTN_DRY  = 0x05, BTN_EXTHT = 0x06
//
// STATUS packet layout (from ESPHome + confirmed against your logs):
//   [4]  time_remaining_hrs
//   [5]  time_remaining_mins
//   [6]  time_remaining_secs
//   [7]  actual_temp_step  (tempC = step/2,  verified: byte[8]=38 at 66F ✓)
//   [8]  target_temp_step
//   [9]  mode (0=standby,1=heat,2=turbo,3=extht,4=cool,5=dry)
//   [10] fan_step 0-19     (verified: byte[10]=19 at 100% fan ✓)
//   [17] ambient_temp_step
// ─────────────────────────────────────────────────────────────────────────────

const SERVICE_UUID = "00001000-bed0-0080-aa55-4265644a6574";
const STATUS_UUID  = "00002000-bed0-0080-aa55-4265644a6574";
const COMMAND_UUID = "00002003-bed0-0080-aa55-4265644a6574";

// Command opcodes
const CMD_BUTTON   = 0x01;
const CMD_SET_TEMP = 0x03;
const CMD_SET_FAN  = 0x07;

// Button values
const BTN = {
  off:   0x01,
  cool:  0x02,
  heat:  0x03,
  turbo: 0x04,
  dry:   0x05,
  extht: 0x06,
};

// Status packet mode byte [9]
const STATUS_MODE = {
  0: "off",
  1: "heat",
  2: "turbo",
  3: "extht",
  4: "cool",
  5: "dry",
};

function tempFtoStep(f) {
  const c = (f - 32) * 5 / 9;
  return Math.round(c * 2);
}

function tempStepToF(step) {
  const c = step / 2;
  return Math.round(c * 9 / 5 + 32);
}

function fanPctToStep(pct) {
  return Math.max(0, Math.min(19, Math.round(pct / 5) - 1));
}

function fanStepToPct(step) {
  return 5 + step * 5;
}

class BedjetBLEService {
  constructor() {
    this.manager         = new BleManager();
    this.connectedDevice = null;
    this.isScanning      = false;
    this.lastPacket      = null;
    this.lastBytes       = null;
    this.pendingPacket   = null;
    this.changeTimer     = null;
    this._statusCallback = null;
  }

  // ── Status callback ───────────────────────────────────────────────────────
  onStatusUpdate(callback) {
    this._statusCallback = callback;
  }

  _parseStatus(base64Value) {
    try {
      const buf = Buffer.from(base64Value, "base64");
      if (buf.length < 11) return null;
      return {
        actualTemp:     tempStepToF(buf[7]),
        targetTemp:     tempStepToF(buf[8]),
        fanPct:         fanStepToPct(buf[10]),
        modeKey:        STATUS_MODE[buf[9]] ?? "off",
        hoursRemaining: buf[4],
        minsRemaining:  buf[5],
        secsRemaining:  buf[6],
      };
    } catch (e) {
      return null;
    }
  }

  // ── Core write — 3-byte packet to 0x2003 ─────────────────────────────────
  async _write(cmd, data, data2 = 0x00) {
    if (!this.connectedDevice) {
      console.warn("BedJet: no device connected");
      return;
    }
    const packet = Buffer.from([cmd, data, data2]);
    const b64 = packet.toString("base64");
    console.log("ATTEMPT WRITE →", [cmd, data, data2]);
    console.log("UUID:", COMMAND_UUID);
    console.log("BASE64:", b64);
    try {
      const result = await this.connectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        COMMAND_UUID,
        b64
      );
      console.log("WRITE SUCCESS:", result);
    } catch (error) {
      console.warn("BEDJET WRITE ERROR:", error);
    }
  }

  // ── Public command API ────────────────────────────────────────────────────

  async turnOff() {
    await this._write(CMD_BUTTON, BTN.off);
  }

  async setCool() {
    await this._write(CMD_BUTTON, BTN.cool);
  }

  async setHeat() {
    await this._write(CMD_BUTTON, BTN.heat);
  }

  async setTurbo() {
    await this._write(CMD_BUTTON, BTN.turbo);
  }

  async setDry() {
    await this._write(CMD_BUTTON, BTN.dry);
  }

  async setMode(modeKey) {
    switch (modeKey) {
      case "cool":  return this.setCool();
      case "heat":  return this.setHeat();
      case "turbo": return this.setTurbo();
      case "dry":   return this.setDry();
      default:      return this.turnOff();
    }
  }

  async setTemperature(tempF) {
    const step = tempFtoStep(Math.max(60, Math.min(109, tempF)));
    await this._write(CMD_SET_TEMP, step);
  }

  async setFanSpeed(pct) {
    const step = fanPctToStep(pct);
    await this._write(CMD_SET_FAN, step);
  }

  // Send mode + temp + fan in sequence
  async sendCommand(modeKey, tempF, fanPct) {
    await this.setMode(modeKey);
    await new Promise(r => setTimeout(r, 150));
    await this.setTemperature(tempF);
    await new Promise(r => setTimeout(r, 150));
    await this.setFanSpeed(fanPct);
  }

  // ── Scan ──────────────────────────────────────────────────────────────────
  async startScan(onDeviceFound) {
    console.log("START SCAN CALLED");
    if (this.isScanning) return;
    this.isScanning = true;

    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("SCAN ERROR:", error);
        this.isScanning = false;
        return;
      }
      if (device?.name === "BEDJET_V3") {
        console.log("BLE DEVICE FOUND:", device);
        onDeviceFound?.({ id: device.id, name: device.name, rssi: device.rssi });
      }
    });

    console.log("SCAN STARTED");
  }

  stopScan() {
    this.manager.stopDeviceScan();
    this.isScanning = false;
  }

  // ── Connect ───────────────────────────────────────────────────────────────
  async connect(deviceId) {
    try {
      console.log("CONNECT ATTEMPT:", deviceId);
      this.stopScan();

      const device = await this.manager.connectToDevice(deviceId, { timeout: 10000 });
      console.log("CONNECTED TO:", device.name);

      const connected = await device.isConnected();
      console.log("IS CONNECTED:", connected);
      if (!connected) throw new Error("Device connection failed");

      await device.discoverAllServicesAndCharacteristics();
      console.log("SERVICES DISCOVERED");

      const services = await device.services();
      console.log("BEDJET SERVICES:", services);

      for (const service of services) {
        const characteristics = await device.characteristicsForService(service.uuid);
        console.log("SERVICE UUID:", service.uuid);
        console.log("CHARACTERISTICS:", characteristics.map((c) => ({
          uuid: c.uuid,
          isReadable: c.isReadable,
          isWritableWithResponse: c.isWritableWithResponse,
          isWritableWithoutResponse: c.isWritableWithoutResponse,
          isNotifiable: c.isNotifiable,
        })));
      }

      // Initial read
      try {
        const readResult = await device.readCharacteristicForService(SERVICE_UUID, STATUS_UUID);
        console.log("BEDJET READ:", readResult);
        console.log("BEDJET BASE64 VALUE:", readResult.value);
        this.lastBytes = null;
        if (readResult.value && this._statusCallback) {
          const status = this._parseStatus(readResult.value);
          if (status) this._statusCallback(status);
        }
      } catch (error) {
        console.log("READ FAILED:", error);
      }

      // Monitor status notifications
      device.monitorCharacteristicForService(SERVICE_UUID, STATUS_UUID, (error, characteristic) => {
        if (error) { console.log("BEDJET MONITOR ERROR:", error); return; }
        const packet = characteristic?.value;
        if (!packet) return;

        const bytes = Buffer.from(packet, "base64");

        // Dispatch to HomeScreen
        const status = this._parseStatus(packet);
        if (status && this._statusCallback) this._statusCallback(status);

        // First packet — set baseline
        if (!this.lastBytes) {
          this.lastBytes = bytes;
          console.log("BASELINE:", [...bytes]);
          return;
        }

        // Change detection (ignore noisy bytes 7 and 17)
        const ignoredIndexes = [7, 17];
        let changed = false;
        for (let i = 0; i < bytes.length; i++) {
          if (ignoredIndexes.includes(i)) continue;
          if (bytes[i] !== this.lastBytes[i]) {
            changed = true;
            console.log("BYTE CHANGED:", i, this.lastBytes[i], "→", bytes[i]);
            break;
          }
        }

        if (!changed) return;

        console.log("REMOTE STATE CHANGE");
        console.log("OLD BYTES:", [...this.lastBytes]);
        console.log("NEW BYTES:", [...bytes]);
        console.log("RAW PACKET:", packet);
        this.lastBytes = bytes;
      });

      this.connectedDevice = device;
      return { success: true, device };
    } catch (error) {
      console.error("CONNECTION ERROR:", error);
      return { success: false, error };
    }
  }

  // ── Disconnect ────────────────────────────────────────────────────────────
  async disconnect() {
    try {
      if (this.connectedDevice) {
        await this.connectedDevice.cancelConnection();
        this.connectedDevice = null;
      }
    } catch (error) {
      console.error("Disconnect error:", error);
    }
  }

  getConnectedDevice() {
    return this.connectedDevice;
  }

  destroy() {
    this.manager.destroy();
  }
}

export default new BedjetBLEService();