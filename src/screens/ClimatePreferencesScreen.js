import React, {
  useState,
  useEffect,
} from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";

import Slider from "@react-native-community/slider";

import {
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import {
  LinearGradient,
} from "expo-linear-gradient";

import {
  useNavigation,
} from "@react-navigation/native";

import {
  useAppearance,
} from "../context/AppearanceContext";

export default function ClimatePreferencesScreen() {
  const navigation =
    useNavigation();

  const {
  temperatureUnit,
  setTemperatureUnit,
  accent,
  colors,
} = useAppearance();

useEffect(() => {
  setTurboLimit(
    temperatureUnit ===
      "F"
      ? 109
      : 43
  );
}, [
  temperatureUnit,
]);

const isFahrenheit =
  temperatureUnit ===
  "F";

const turboMin =
  isFahrenheit
    ? 60
    : 16;

const turboMax =
  isFahrenheit
    ? 109
    : 43;

const displaySymbol =
  isFahrenheit
    ? "°F"
    : "°C";

  const [
    rememberLast,
    setRememberLast,
  ] = useState(true);

  const [
    safetyLimit,
    setSafetyLimit,
  ] = useState(true);

  const [
    startupMode,
    setStartupMode,
  ] = useState("cool");

  const [
    fanSpeed,
    setFanSpeed,
  ] = useState(55);

  const [
    turboLimit,
    setTurboLimit,
  ] = useState(109);

  const modes = [
    "cool",
    "turbo",
    "dry",
    "off",
  ];

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[
          "#020617",
          "#020712",
          "#06101F",
        ]}
        style={
          StyleSheet.absoluteFill
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.content
        }
      >
        <View
          style={
            styles.header
          }
        >
          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
            style={
              styles.back
            }
          >
            <Ionicons
              name="chevron-back"
              size={26}
              color="#FFF"
            />
          </TouchableOpacity>

          <Text
            style={
              styles.headerTitle
            }
          >
            Climate
            Preferences
          </Text>

          <View
            style={{
              width: 34,
            }}
          />
        </View>

        <Text
          style={
            styles.subtitle
          }
        >
          Default
          comfort
          behavior and
          startup
          preferences
        </Text>

        <View
          style={
            styles.group
          }
        >
          <SettingRow
  title="Temperature Unit"
  subtitle="Choose between Fahrenheit and Celsius"
  right={
    <View
      style={
        styles.segment
      }
    >
      <TouchableOpacity
        onPress={() =>
          setTemperatureUnit(
            "F"
          )
        }
        style={[
          styles.segmentButton,
          temperatureUnit ===
            "F" &&
            styles.segmentActive,
        ]}
      >
        <Text
          style={[
            styles.segmentText,
            temperatureUnit ===
              "F" &&
              styles.segmentTextActive,
          ]}
        >
          °F
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          setTemperatureUnit(
            "C"
          )
        }
        style={[
          styles.segmentButton,
          temperatureUnit ===
            "C" &&
            styles.segmentActive,
        ]}
      >
        <Text
          style={[
            styles.segmentText,
            temperatureUnit ===
              "C" &&
              styles.segmentTextActive,
          ]}
        >
          °C
        </Text>
      </TouchableOpacity>
    </View>
  }
/>

          <SettingRow
            title="Remember Last Settings"
            subtitle="Restore your last temperature and mode"
            right={
              <Switch
                value={
                  rememberLast
                }
                onValueChange={
                  setRememberLast
                }
              />
            }
          />

          <SettingRow
            title="Temperature Safety Limit"
            subtitle="Prevent temperatures above safe limits"
            right={
              <Switch
                value={
                  safetyLimit
                }
                onValueChange={
                  setSafetyLimit
                }
              />
            }
            isLast
          />
        </View>

        <Text
          style={
            styles.section
          }
        >
          Startup Mode
        </Text>

        <View
          style={
            styles.modeRow
          }
        >
          {modes.map(
            (mode) => {
              const active =
                startupMode ===
                mode;

              return (
                <TouchableOpacity
                  key={
                    mode
                  }
                  onPress={() =>
                    setStartupMode(
                      mode
                    )
                  }
                  style={[
                    styles.modeCard,
                    active && {
                      borderColor:
                        accent,
                      backgroundColor:
                        "rgba(22,131,255,0.12)",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.modeText,
                      active && {
                        color:
                          accent,
                      },
                    ]}
                  >
                    {mode.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            }
          )}
        </View>

        <View
          style={
            styles.group
          }
        >
          <View
            style={
              styles.sliderRow
            }
          >
            <Text
              style={
                styles.sliderTitle
              }
            >
              Default Fan Speed
            </Text>

            <Text
              style={
                styles.sliderValue
              }
            >
              {fanSpeed}%
            </Text>
          </View>

          <Slider
            minimumValue={
              0
            }
            maximumValue={
              100
            }
            value={
              fanSpeed
            }
            minimumTrackTintColor={
              accent
            }
            maximumTrackTintColor="rgba(255,255,255,0.12)"
            thumbTintColor={
              accent
            }
            onValueChange={(
              v
            ) =>
              setFanSpeed(
                Math.round(
                  v
                )
              )
            }
          />
        </View>

        <View
          style={
            styles.group
          }
        >
          <View
            style={
              styles.sliderRow
            }
          >
            <Text
              style={
                styles.sliderTitle
              }
            >
              Turbo Heat
              Limit
            </Text>

            <Text
              style={
                styles.sliderValue
              }
            >
              {
                turboLimit
              }
              °
            </Text>
          </View>

          <Slider
            minimumValue={
              60
            }
            maximumValue={
              109
            }
            value={
              turboLimit
            }
            minimumTrackTintColor="#F59E0B"
            maximumTrackTintColor="rgba(255,255,255,0.12)"
            thumbTintColor="#F59E0B"
            onValueChange={(
              v
            ) =>
              setTurboLimit(
                Math.round(
                  v
                )
              )
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}

function SettingRow({
  title,
  subtitle,
  right,
  isLast,
}) {
  return (
    <View
      style={[
        styles.row,
        !isLast &&
          styles.rowBorder,
      ]}
    >
      <View
        style={
          styles.rowText
        }
      >
        <Text
          style={
            styles.rowTitle
          }
        >
          {title}
        </Text>

        <Text
          style={
            styles.rowSubtitle
          }
        >
          {subtitle}
        </Text>
      </View>

      {right}
    </View>
  );
}

const styles =
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor:
        "#020617",
    },

    content: {
      paddingTop: 60,
      paddingHorizontal:
        20,
      paddingBottom:
        120,
    },

    header: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
      marginBottom:
        8,
    },

    back: {
      padding: 4,
    },

    headerTitle:
      {
        color:
          "#FFF",
        fontSize: 28,
        fontWeight:
          "700",
      },

    subtitle: {
      color:
        "rgba(255,255,255,0.45)",
      marginBottom:
        24,
    },

    group: {
      backgroundColor:
        "rgba(255,255,255,0.04)",
      borderRadius:
        20,
      overflow:
        "hidden",
      borderWidth:
        1,
      borderColor:
        "rgba(255,255,255,0.06)",
      marginBottom:
        20,
      padding:
        18,
    },

    row: {
      flexDirection:
        "row",
      justifyContent:
        "space-between",
      alignItems:
        "center",
      paddingVertical:
        14,
    },

    rowBorder:
      {
        borderBottomWidth:
          1,
        borderBottomColor:
          "rgba(255,255,255,0.06)",
      },

    rowText: {
      flex: 1,
      marginRight:
        12,
    },

    rowTitle: {
      color:
        "#FFF",
      fontWeight:
        "600",
      marginBottom:
        2,
    },

    rowSubtitle:
      {
        color:
          "rgba(255,255,255,0.45)",
        fontSize:
          13,
      },

    segment: {
      flexDirection:
        "row",
      backgroundColor:
        "rgba(255,255,255,0.05)",
      borderRadius:
        14,
      overflow:
        "hidden",
    },

    segmentButton:
      {
        paddingHorizontal:
          18,
        paddingVertical:
          10,
      },

    segmentActive:
      {
        backgroundColor:
          "rgba(22,131,255,0.15)",
      },

    segmentText:
      {
        color:
          "rgba(255,255,255,0.45)",
      },

    segmentTextActive:
      {
        color:
          "#1683FF",
        fontWeight:
          "700",
      },

    section: {
      color:
        "#FFF",
      fontSize:
        22,
      marginBottom:
        16,
    },

    modeRow: {
      flexDirection:
        "row",
      gap: 10,
      marginBottom:
        20,
    },

    modeCard: {
      flex: 1,
      height: 62,
      borderRadius:
        18,
      justifyContent:
        "center",
      alignItems:
        "center",
      backgroundColor:
        "rgba(255,255,255,0.04)",
      borderWidth:
        1,
      borderColor:
        "rgba(255,255,255,0.06)",
    },

    modeText: {
      color:
        "#FFF",
      fontSize:
        13,
      fontWeight:
        "600",
    },

    sliderRow:
      {
        flexDirection:
          "row",
        justifyContent:
          "space-between",
        marginBottom:
          10,
      },

    sliderTitle:
      {
        color:
          "#FFF",
        fontSize:
          16,
        fontWeight:
          "600",
      },

    sliderValue:
      {
        color:
          "#1683FF",
        fontWeight:
          "700",
      },
  });