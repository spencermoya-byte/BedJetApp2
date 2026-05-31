import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Appearance,
} from "react-native";

import { themeService } from "../services/storage/themeService";

const ThemeContext =
  createContext();

export function ThemeProvider({
  children,
}) {
  const [theme, setTheme] =
    useState("system");

  const [systemTheme, setSystemTheme] =
    useState(
      Appearance.getColorScheme() ||
        "light"
    );

  useEffect(() => {
    loadTheme();

    const subscription =
      Appearance.addChangeListener(
        ({ colorScheme }) => {
          setSystemTheme(
            colorScheme ||
              "light"
          );
        }
      );

    return () => {
      subscription.remove();
    };
  }, []);

  const loadTheme =
    async () => {
      const saved =
        await themeService.getTheme();

      setTheme(saved);
    };

  const updateTheme =
    async (value) => {
      setTheme(value);

      await themeService.saveTheme(
        value
      );
    };

  const resolvedTheme =
    theme === "system"
      ? systemTheme
      : theme;

  const colors =
    resolvedTheme ===
    "dark"
      ? {
          background:
            "#050816",

          card:
            "rgba(255,255,255,0.06)",

          cardSolid:
            "#111827",

          text: "#FFFFFF",

          textSecondary:
            "#A1A1AA",

          primary:
            "#5B5BF7",

          border:
            "rgba(255,255,255,0.08)",
        }
      : {
          background:
            "#F5F5FA",

          card: "#FFFFFF",

          cardSolid:
            "#FFFFFF",

          text: "#111827",

          textSecondary:
            "#6B7280",

          primary:
            "#5B5BF7",

          border:
            "#E5E7EB",
        };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        updateTheme,
        colors,
        resolvedTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(
    ThemeContext
  );
}