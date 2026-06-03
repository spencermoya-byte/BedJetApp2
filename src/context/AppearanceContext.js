import React, { createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";

const AppearanceContext = createContext(null);

export function AppearanceProvider({ children }) {
  const systemScheme = useColorScheme(); // "light" | "dark" | null

  const [theme,             setTheme]             = useState("system"); // "light" | "dark" | "system"
  const [reduceMotion,      setReduceMotion]       = useState(false);
  const [reduceGlow,        setReduceGlow]         = useState(false);
  const [reduceVisualNoise, setReduceVisualNoise]  = useState(false);
  const [calmMode,          setCalmMode]           = useState(false);
  const [highContrast,      setHighContrast]       = useState(false);
  const [accentColor,       setAccentColor]        = useState("blue");
  const [temperatureUnit,   setTemperatureUnit]    = useState("F");
    // Resolve the actual active scheme
  const resolvedTheme =
    theme === "system"
      ? (systemScheme ?? "dark")
      : theme;

  const isDark = resolvedTheme === "dark";

  // Accent color values
  const ACCENT_MAP = {
    blue:    "#1683FF",
    warm:    "#F59E0B",
    minimal: "#94A3B8",
  };
  const accent = ACCENT_MAP[accentColor] ?? "#1683FF";

  function handleCalmMode(val) {
    setCalmMode(val);
    if (val) {
      setReduceMotion(true);
      setReduceGlow(true);
      setReduceVisualNoise(true);
    }
  }

  // ── Derived theme tokens ───────────────────────────────────────────────
  // All screens import these instead of hardcoding colors.
  const colors = {
    // Backgrounds
    bg:        isDark ? "#020617" : "#F0F4F8",
    bgGrad:    isDark
      ? ["#020617", "#020712", "#06101F"]
      : ["#E8EFF7", "#EDF2F9", "#F0F4F8"],
    card:      isDark
      ? (reduceGlow ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.05)")
      : "rgba(0,0,0,0.04)",
    cardBorder:isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",

    // Text
    text:      isDark ? "#FFFFFF" : "#0F172A",
    textSub:   isDark
      ? (highContrast ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.5)")
      : (highContrast ? "rgba(0,0,0,0.7)"       : "rgba(0,0,0,0.5)"),
    textMuted: isDark
      ? (highContrast ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.35)")
      : (highContrast ? "rgba(0,0,0,0.5)"       : "rgba(0,0,0,0.35)"),

    // Accent
    accent,
    accentFaded: reduceGlow ? `${accent}18` : `${accent}28`,

    // Dividers
    divider: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)",

    // Tab bar
    tabBg: isDark ? "rgba(12,18,32,0.75)" : "rgba(255,255,255,0.85)",
    tabBorder: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.08)",
    tabActive: accent,
    tabInactive: isDark ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.35)",
  };

  return (
    <AppearanceContext.Provider value={{
      // Settings
      theme, setTheme,
      temperatureUnit, setTemperatureUnit,
      reduceMotion, setReduceMotion,
      reduceGlow, setReduceGlow,
      reduceVisualNoise, setReduceVisualNoise,
      calmMode, handleCalmMode,
      highContrast, setHighContrast,
      accentColor, setAccentColor,
      // Derived
      isDark,
      accent,
      colors,
    }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const ctx = useContext(AppearanceContext);
  if (!ctx) throw new Error("useAppearance must be used inside AppearanceProvider");
  return ctx;
}