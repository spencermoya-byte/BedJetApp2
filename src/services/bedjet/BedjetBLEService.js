import { BleManager } from "react-native-ble-plx";
import { Platform, PermissionsAndroid } from "react-native";
import { Buffer } from "buffer";

// ─── BedJet V3 BLE Protocol ───────────────────────────────────────────────
// Service:         00001000-bed0-0080-aa55-4265644a6574
// Status (notify): 00002000-bed0-0080-aa55-4265644a6574
// Command (write): 00002003-bed0-0080-aa55-4265644a6574
//
// STATUS packet (11 bytes):
//   [3]  actual temp  = byte + 60 → °F
//   [4]  target temp  = byte + 60 → °F
//   [7]  fan speed    = byte (0–100)
//   [8]  mode         = 0x00=off 0x01=cool 0x02=heat 0x03=turbo 0x04=dry
//
// COMMAND packet (7 bytes):
//   [0]  0x01  (command identifier)
//   [1]  mode  (0x00–0x04)
//   [2]  target temp - 60
//   [3]  fan speed (0–100)
//   [4]  0x00  (reserved)
//   [5]  run hours  (0 = off, 8 = normal)
//   [6]  run minutes
// ─────────────────────────────────────────────────────────────────────────

const SERVICE_UUID = "00001000-bed0-0080-aa55-4265644a6574";
const STATUS_UUID  = "00002000-bed0-0080-aa55-4265644a6574";
const COMMAND_UUID = "00002003-bed0-0080-aa55-4265644a6574";

const MODE_BYTES = {
  off:   0x01,  // STANDBY
  cool:  0x02,  // COOL
  heat:  0x03,  // HEAT
  turbo: 0x04,  // TURBO
  dry:   0x05,  // DRY
};

class BedjetBLEService {
  constructor() {
    this.manager         = new BleManager();
    this.connectedDevice = null;
    this.isScanning      = false;
    this.lastPacket      = null;
    this.lastBytes       = null;
    this.pendingPacket   = null;
    this.changeTimer     = null;

    // Status callback — set by HomeScreen via onStatusUpdate()
    this._statusCallback = null;
  }

  // ── Register a callback to receive parsed status updates ─────────────────
  // HomeScreen calls: bedjetBLEService.onStatusUpdate((status) => { ... })
  // status = { actualTemp, targetTemp, fanSpeed, mode, modeKey }
  onStatusUpdate(callback) {
    this._statusCallback = callback;
  }

  _parseStatus(base64Value) {
    try {
      const buf = Buffer.from(base64Value, "base64");
      if (buf.length < 11) return null;
      const modeKeyMap = { 0: "off", 1: "cool", 2: "heat", 3: "turbo", 4: "dry", 5: "dry" };
      return {
        actualTemp: buf[3] + 60,
        targetTemp: buf[4] + 60,
        fanSpeed:   buf[7],
        mode:       buf[8],
        modeKey:    modeKeyMap[buf[8]] ?? "off",
      };
    } catch (e) {
      return null;
    }
  }

  // ── Write a raw packet to the command characteristic ─────────────────────
  async _write(bytes) {
  if (!this.connectedDevice) {
    console.warn(
      "BedJet: no device connected"
    );
    return;
  }

  const b64 =
    Buffer.from(bytes)
      .toString("base64");

  console.log(
    "ATTEMPT WRITE →",
    bytes
  );

  console.log(
    "UUID:",
    COMMAND_UUID
  );

  console.log(
    "BASE64:",
    b64
  );

  try {
    const result =
      await this.connectedDevice.writeCharacteristicWithResponseForService(
        SERVICE_UUID,
        COMMAND_UUID,
        b64
      );

    console.log(
      "WRITE SUCCESS:",
      result
    );
  } catch (
    error
  ) {
    console.warn(
      "BEDJET WRITE ERROR:",
      error
    );
  }
}

  // ── Individual commands (BedJet V3 protocol) ──────────────────────────────
  // Each command is a short independent packet written to 0x2001.
  // Mode commands: 1 byte   [cmd]
  // Temp command:  2 bytes  [0x07, tempF - 60]
  // Fan command:   2 bytes  [0x08, fan%]

  async setMode(modeKey) {
    const cmd = MODE_BYTES[modeKey];
    if (cmd === undefined) return;
    await this._write([cmd]);
  }

  async setTemperature(tempF) {
    const temp = Math.max(60, Math.min(109, Math.round(tempF)));
    await this._write([0x07, temp - 60]);
  }

  async setFanSpeed(fan) {
    const f = Math.max(0, Math.min(100, Math.round(fan)));
    await this._write([0x08, f]);
  }

  async turnOff() {
  await this._write([
    0x01,
    MODE_BYTES.off,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
  ]);
}

  // Convenience — set mode + temp + fan in sequence
  async sendCommand(
  modeKey,
  tempF,
  fanSpeed
) {
  const mode =
    MODE_BYTES[
      modeKey
    ];

  if (
    mode ===
    undefined
  ) {
    console.warn(
      "Unknown mode:",
      modeKey
    );

    return;
  }

  const temp =
    Math.max(
      60,
      Math.min(
        109,
        Math.round(
          tempF
        )
      )
    );

  const fan =
    Math.max(
      0,
      Math.min(
        100,
        Math.round(
          fanSpeed
        )
      )
    );

  const packet = [
    0x01,
    mode,
    temp - 60,
    fan,
    0x00,
    0x08,
    0x00,
  ];

  console.log(
    "FULL BEDJET CMD:",
    packet
  );

  await this._write(
    packet
  );
}

  // ── Existing methods — unchanged ─────────────────────────────────────────

  async requestPermissions() {
    if (Platform.OS === "ios") {
      return true;
    }

    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      return Object.values(granted).every(
        permission => permission === PermissionsAndroid.RESULTS.GRANTED
      );
    }

    return false;
  }

  async startScan(onDeviceFound) {
    if (this.isScanning) return;

    const hasPermission = await this.requestPermissions();
    if (!hasPermission) throw new Error("Bluetooth permissions denied");

    const state = await this.manager.state();

    if (state !== "PoweredOn") {
      console.log("Waiting for Bluetooth...");
      return new Promise((resolve, reject) => {
        const subscription = this.manager.onStateChange((newState) => {
          if (newState === "PoweredOn") {
            subscription.remove();
            this.startScan(onDeviceFound);
            resolve();
          }
        }, true);
      });
    }

    this.isScanning = true;
    const foundDevices = new Map();

    this.manager.startDeviceScan(null, { allowDuplicates: false }, (error, device) => {
      if (error) {
        console.error("BLE scan error:", error);
        this.stopScan();
        return;
      }
      if (!device) return;

      const name = device.name || device.localName || "";
      const looksLikeBedjet =
        (name && name.toUpperCase().includes("BEDJET")) ||
        device.serviceUUIDs?.some(uuid => uuid.toLowerCase().includes("bed0"));

      if (looksLikeBedjet && !foundDevices.has(device.id)) {
        foundDevices.set(device.id, device);
        console.log("BLE DEVICE FOUND:", {
          id: device.id, name: device.name, localName: device.localName,
          rssi: device.rssi, serviceUUIDs: device.serviceUUIDs,
          manufacturerData: device.manufacturerData,
        });
        if (onDeviceFound) {
          onDeviceFound({ id: device.id, name: name || "BedJet", rssi: device.rssi });
        }
      }
    });
  }

  stopScan() {
    this.manager.stopDeviceScan();
    this.isScanning = false;
  }

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
        this.lastStatus = undefined;

        // Dispatch initial status
        if (readResult.value && this._statusCallback) {
          const status = this._parseStatus(readResult.value);
          if (status) this._statusCallback(status);
        }
      } catch (error) {
        console.log("READ FAILED:", error);
      }

      // Monitor for ongoing status changes
      device.monitorCharacteristicForService(
  SERVICE_UUID,
  STATUS_UUID,
  (
    error,
    characteristic
  ) => {
    if (error) {
      console.log(
        "BEDJET MONITOR ERROR:",
        error
      );

      return;
    }

    const packet =
      characteristic?.value;

    if (!packet) {
      return;
    }

    const bytes =
      Buffer.from(
        packet,
        "base64"
      );

    // Update UI
    const status =
      this._parseStatus(
        packet
      );

    if (
      status &&
      this._statusCallback
    ) {
      this._statusCallback(
        status
      );
    }

    // First packet baseline
    if (
      !this.lastBytes
    ) {
      this.lastBytes =
        bytes;

      console.log(
        "BASELINE:",
        [...bytes]
      );

      return;
    }

    // Only compare meaningful bytes
    const ignoredIndexes =
  [
    6,
    7,
    17,
  ];

    let changed =
  false;

for (
  let i = 0;
  i < bytes.length;
  i++
) {
  if (
    ignoredIndexes.includes(
      i
    )
  ) {
    continue;
  }

  if (
    bytes[i] !==
    this.lastBytes[i]
  ) {
    changed =
      true;

    console.log(
      "BYTE CHANGED:",
      i,
      this.lastBytes[i],
      "→",
      bytes[i]
    );

    break;
  }
}

    // Ignore heartbeat spam
    if (
      !changed
    ) {
      return;
    }

    console.log(
      "REMOTE STATE CHANGE"
    );

    console.log(
      "OLD BYTES:",
      [...this.lastBytes]
    );

    console.log(
      "NEW BYTES:",
      [...bytes]
    );

    console.log(
      "RAW PACKET:",
      packet
    );

    this.lastBytes =
      bytes;
  }
);

      this.connectedDevice = device;
      return { success: true, device };
    } catch (error) {
      console.error("CONNECTION ERROR:", error);
      return { success: false, error };
    }
  }

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