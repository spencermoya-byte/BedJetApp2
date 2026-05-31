import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_KEY = "bedjet_theme";

export const themeService = {
  async saveTheme(theme) {
    await AsyncStorage.setItem(
      THEME_KEY,
      theme
    );
  },

  async getTheme() {
    const saved =
      await AsyncStorage.getItem(
        THEME_KEY
      );

    return saved || "system";
  },
};