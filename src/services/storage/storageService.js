import AsyncStorage from "@react-native-async-storage/async-storage";

const PAIRED_KEY = "bedjet_is_paired";

export const storageService = {
  async setPaired(value) {
    await AsyncStorage.setItem(
      PAIRED_KEY,
      JSON.stringify(value)
    );
  },

  async isPaired() {
    const value =
      await AsyncStorage.getItem(
        PAIRED_KEY
      );

    return false;
  },
};