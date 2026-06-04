import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import BedjetBLEService from "../services/bedjet/BedjetBLEService";

const BedjetContext =
  createContext(null);

export function BedjetProvider({
  children,
}) {
  const [
    devices,
    setDevices,
  ] = useState([]);

  const [
    connectedDevice,
    setConnectedDevice,
  ] = useState(null);

  const [
    scanning,
    setScanning,
  ] = useState(false);

  const [
    firmwareVersion,
    setFirmwareVersion,
  ] = useState(null);

  const [
    bedjetVersion,
    setBedjetVersion,
  ] = useState(null);

  async function startScan() {
  console.log(
    "START SCAN CALLED"
  );

  setDevices([]);

  setScanning(
    true
  );

  try {
    await BedjetBLEService.startScan(
      device => {
        console.log(
          "DEVICE RECEIVED:",
          device
        );

        setDevices(
          prev => {
            const exists =
              prev.some(
                d =>
                  d.id ===
                  device.id
              );

            if (
              exists
            ) {
              return prev;
            }

            return [
              ...prev,
              device,
            ];
          }
        );
      }
    );

    console.log(
      "SCAN STARTED"
    );
  } catch (
    error
  ) {
    console.error(
      "SCAN ERROR:",
      error
    );

    setScanning(
      false
    );
  }
}

  function stopScan() {
    BedjetBLEService.stopScan();
    setScanning(false);
  }

  async function connectToDevice(
    deviceId
  ) {
    const result =
      await BedjetBLEService.connect(
        deviceId
      );

    if (
      result.success
    ) {
      setConnectedDevice(
        result.device
      );

      // Placeholder values
      // Real BedJet parsing comes next
      setFirmwareVersion(
        "Reading..."
      );
      setBedjetVersion(
        "Detecting..."
      );
    }

    return result;
  }

  async function disconnect() {
    await BedjetBLEService.disconnect();

    setConnectedDevice(
      null
    );

    setFirmwareVersion(
      null
    );

    setBedjetVersion(
      null
    );
  }

  const value =
    useMemo(
      () => ({
        devices,
        scanning,
        connectedDevice,
        firmwareVersion,
        bedjetVersion,
        startScan,
        stopScan,
        connectToDevice,
        disconnect,
      }),
      [
        devices,
        scanning,
        connectedDevice,
        firmwareVersion,
        bedjetVersion,
      ]
    );

  return (
    <BedjetContext.Provider
      value={value}
    >
      {children}
    </BedjetContext.Provider>
  );
}

export function useBedjet() {
  const context =
    useContext(
      BedjetContext
    );

  if (
    !context
  ) {
    throw new Error(
      "useBedjet must be used inside BedjetProvider"
    );
  }

  return context;
}