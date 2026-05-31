import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import Slider from "@react-native-community/slider";

import {
  useTheme,
} from "../hooks/ThemeContext";

export default function HomeScreen() {
  const { colors, resolvedTheme } =
    useTheme();

  const [temperature, setTemperature] =
    useState(72);

  const [fanSpeed, setFanSpeed] =
    useState(55);

  const [mode, setMode] =
    useState("cool");

  const isDark =
    resolvedTheme === "dark";

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
      contentContainerStyle={{
        paddingBottom: 120,
      }}
      showsVerticalScrollIndicator={
        false
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            styles.greeting,
            {
              color:
                colors.text,
            },
          ]}
        >
          Good Evening
        </Text>

        <Text
          style={[
            styles.device,
            {
              color:
                colors.textSecondary,
            },
          ]}
        >
          BedJet 3 Connected
        </Text>
      </View>

      {/* Main Climate Card */}
      <View
        style={[
          styles.tempCard,
          isDark
            ? styles.darkTempCard
            : styles.lightTempCard,
        ]}
      >
        <Text
          style={[
            styles.tempLabel,
            {
              color:
                isDark
                  ? "#A1A1AA"
                  : "#FFF",
            },
          ]}
        >
          Climate Control
        </Text>

        <Text
          style={styles.tempValue}
        >
          {temperature}°
        </Text>

        <Text
          style={[
            styles.modeText,
            {
              color:
                isDark
                  ? "#D1D5DB"
                  : "#FFF",
            },
          ]}
        >
          {mode === "cool"
            ? "Cooling"
            : "Heating"}
        </Text>
      </View>

      {/* Toggle */}
      <View style={styles.modeRow}>
        {[
          "cool",
          "heat",
        ].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.modeButton,
              {
                backgroundColor:
                  mode === item
                    ? colors.primary
                    : colors.cardSolid,
              },
            ]}
            onPress={() =>
              setMode(item)
            }
          >
            <Text
              style={[
                styles.modeButtonText,
                {
                  color:
                    mode === item
                      ? "#FFF"
                      : colors.text,
                },
              ]}
            >
              {item ===
              "cool"
                ? "Cooling"
                : "Heating"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Temp Slider */}
      <View
        style={[
          styles.card,
          {
            backgroundColor:
              colors.cardSolid,
          },
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            {
              color:
                colors.text,
            },
          ]}
        >
          Temperature
        </Text>

        <Slider
          minimumValue={60}
          maximumValue={95}
          step={1}
          value={temperature}
          onValueChange={
            setTemperature
          }
        />

        <Text
          style={[
            styles.value,
            {
              color:
                colors.primary,
            },
          ]}
        >
          {temperature}°F
        </Text>
      </View>

      {/* Fan Speed */}
      <View
        style={[
          styles.card,
          {
            backgroundColor:
              colors.cardSolid,
          },
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            {
              color:
                colors.text,
            },
          ]}
        >
          Fan Speed
        </Text>

        <Slider
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={fanSpeed}
          onValueChange={
            setFanSpeed
          }
        />

        <Text
          style={[
            styles.value,
            {
              color:
                colors.primary,
            },
          ]}
        >
          {fanSpeed}%
        </Text>
      </View>

      {/* Quick Actions */}
      <Text
        style={[
          styles.section,
          {
            color:
              colors.text,
          },
        ]}
      >
        Quick Actions
      </Text>

      <View style={styles.quickGrid}>
        {[
          "Sleep",
          "Turbo Cool",
          "Warm Bed",
          "Dry Mode",
        ].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.quickButton,
              {
                backgroundColor:
                  colors.cardSolid,
              },
            ]}
          >
            <Text
              style={{
                color:
                  colors.text,
                fontWeight:
                  "600",
              }}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 70,
    },

    header: {
      marginBottom: 26,
    },

    greeting: {
      fontSize: 34,
      fontWeight: "700",
    },

    device: {
      fontSize: 17,
      marginTop: 4,
    },

    tempCard: {
      borderRadius: 36,
      padding: 32,
      marginBottom: 20,
    },

    lightTempCard: {
      backgroundColor:
        "#5B5BF7",
    },

    darkTempCard: {
      backgroundColor:
        "#111827",
      borderWidth: 1,
      borderColor:
        "rgba(255,255,255,0.08)",
    },

    tempLabel: {
      fontSize: 18,
    },

    tempValue: {
      color: "#FFF",
      fontSize: 72,
      fontWeight: "700",
      marginTop: 8,
    },

    modeText: {
      fontSize: 20,
    },

    modeRow: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 20,
    },

    modeButton: {
      flex: 1,
      borderRadius: 20,
      padding: 18,
      alignItems: "center",
    },

    modeButtonText: {
      fontWeight: "600",
    },

    card: {
      borderRadius: 28,
      padding: 22,
      marginBottom: 18,
    },

    cardTitle: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 12,
    },

    value: {
      textAlign: "right",
      marginTop: 6,
      fontWeight: "700",
    },

    section: {
      fontSize: 22,
      fontWeight: "700",
      marginTop: 8,
      marginBottom: 14,
    },

    quickGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },

    quickButton: {
      width: "47%",
      borderRadius: 24,
      paddingVertical: 24,
      alignItems: "center",
    },
  });