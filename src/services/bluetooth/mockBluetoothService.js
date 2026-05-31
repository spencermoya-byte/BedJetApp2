export const mockBluetoothService = {
  async scanForDevice() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: "bedjet3",

          modelName:
            "BedJet 3",

          image: require("../../assets/images/bedjet3.png"),

          connected: false,
        });
      }, 2200);
    });
  },

  async connect() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 1800);
    });
  },
};