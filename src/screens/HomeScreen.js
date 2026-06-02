// REPLACE YOUR ENTIRE HomeScreen.js WITH THIS FILE

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  PanResponder,
} from "react-native";
import Slider from "@react-native-community/slider";
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, {
  Circle,
} from "react-native-svg";

const { width } =
  Dimensions.get(
    "window"
  );

export default function HomeScreen() {
  const [temperature, setTemperature] =
    useState(72);

  const [fanSpeed, setFanSpeed] =
    useState(55);

  const [mode, setMode] =
    useState("cool");

  const [isDragging, setIsDragging] =
    useState(false);

  const accent =
  mode === "cool"
    ? "#1683FF"
    : mode === "turbo"
      ? "#F59E0B"
      : mode === "dry"
        ? "#38BDF8"
        : "#6B7280";

  const dialSize =
    width * 0.74;

  const strokeWidth =
    10;

  const radius =
    (dialSize -
      strokeWidth) /
    2;

  const center =
    dialSize / 2;

  const minAngle =
    -140;

  const maxAngle =
    140;

  const angleRange =
    maxAngle -
    minAngle;

  const initialAngle =
    ((temperature -
      60) /
      35) *
      angleRange +
    minAngle;

  const [dialAngle, setDialAngle] =
    useState(
      initialAngle
    );

  const circumference =
    2 *
    Math.PI *
    radius;

  const gapDegrees =
    80;

  const visibleArcDegrees =
    360 -
    gapDegrees;

  const visibleArcLength =
    circumference *
    (visibleArcDegrees /
      360);

  const gapLength =
    circumference -
    visibleArcLength;

  const normalized =
    (dialAngle -
      minAngle) /
    angleRange;

  const progressOffset =
    visibleArcLength *
    (1 -
      normalized);

  const radians =
  ((dialAngle +
    40) *
    Math.PI) /
  180;

  const knobRadius =
  radius + 4;

  const knobSize =
    30;

  const knobX =
    center +
    knobRadius *
      Math.cos(
        radians
      );

  const knobY =
    center +
    knobRadius *
      Math.sin(
        radians
      );

  const panResponder =
    useMemo(
      () =>
        PanResponder.create(
          {
            onStartShouldSetPanResponder:
              () =>
                true,

            onMoveShouldSetPanResponder:
              () =>
                true,

            onPanResponderGrant:
              () => {
                setIsDragging(
                  true
                );
              },

            onPanResponderMove:
              (
                _,
                gesture
              ) => {
                const cx =
                  width /
                  2;

                const cy =
                  288;

                const dx =
                  gesture.moveX -
                  cx;

                const dy =
                  gesture.moveY -
                  cy;

                let angle =
                  Math.atan2(
                    dy,
                    dx
                  ) *
                  (180 /
                    Math.PI);

                angle +=
                  90;

                if (
                  angle >
                  180
                ) {
                  angle -=
                    360;
                }

                angle =
                  Math.max(
                    minAngle,
                    Math.min(
                      maxAngle,
                      angle
                    )
                  );

                setDialAngle(
                  angle
                );

                const temp =
                  Math.round(
                    60 +
                      ((angle -
                        minAngle) /
                        angleRange) *
                        35
                  );

                setTemperature(
                  temp
                );
              },

            onPanResponderRelease:
              () => {
                setIsDragging(
                  false
                );
              },

            onPanResponderTerminate:
              () => {
                setIsDragging(
                  false
                );
              },
          }
        ),
      []
    );

  const modes =
    [
      {
        key: "off",
        label:
          "OFF",
        icon:
          "power",
        color:
          "#5E6573",
      },
      {
        key:
          "turbo",
        label:
          "TURBO\nHEAT",
        icon:
          "fire",
        color:
          "#C7893A",
      },
      {
        key:
          "cool",
        label:
          "COOL",
        icon:
          "snowflake",
        color:
          accent,
      },
      {
        key:
          "dry",
        label:
          "DRY\nMODE",
        icon:
          "water-outline",
        color:
          "#5E6573",
      },
    ];

  return (
    <View
      style={
        styles.root
      }
    >
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
        scrollEnabled={
          !isDragging
        }
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
          <View
            style={
              styles.connectedRow
            }
          >
            <View
              style={
                styles.greenDot
              }
            />

            <Text
              style={
                styles.connected
              }
            >
              BedJet 3
              Connected
            </Text>
          </View>

          <View
            style={
              styles.headerButtons
            }
          >
            <TouchableOpacity
              style={
                styles.headerCircle
              }
            >
              <Ionicons
                name="notifications-outline"
                size={
                  24
                }
                color="#FFF"
              />
              <View
                style={
                  styles.blueDot
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.headerCircle
              }
            >
              <Ionicons
                name="settings-outline"
                size={
                  24
                }
                color="#FFF"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={
            styles.dialBox
          }
        >
          <Svg
            width={
              dialSize
            }
            height={
              dialSize
            }
          >
            <Circle
  cx={center}
  cy={center}
  r={radius}
  stroke={accent}
  strokeWidth={strokeWidth}
  fill="none"
  strokeDasharray={[
    visibleArcLength *
      normalized,
    circumference,
  ]}
  rotation="130"
  origin={`${center}, ${center}`}
  strokeLinecap="round"
/>

            <Circle
              cx={
                center
              }
              cy={
                center
              }
              r={
                radius
              }
              stroke={
                accent
              }
              strokeWidth={
                strokeWidth
              }
              fill="none"
              strokeDasharray={[
                visibleArcLength,
                gapLength,
              ]}
              strokeDashoffset={
                progressOffset
              }
              rotation="130"
              origin={`${center}, ${center}`}
              strokeLinecap="round"
            />
          </Svg>

          <View
            {...panResponder.panHandlers}
            style={[
              styles.knob,
              {
                left:
                  knobX -
                  knobSize /
                    2,
                top:
                  knobY -
                  knobSize /
                    2,
              },
            ]}
          />

          <MaterialCommunityIcons
            name="snowflake"
            size={
              42
            }
            color={
              accent
            }
            style={
              styles.snowflake
            }
          />

          <Text style={styles.modeLabel}>
  {mode === "off"
    ? "OFF"
    : mode === "turbo"
      ? "TURBO HEAT"
      : mode === "dry"
        ? "DRY MODE"
        : "COOL MODE"}
</Text>

          <Text
            style={
              styles.temp
            }
          >
            {
              temperature
            }
            °
          </Text>

          <Text
            style={
              styles.target
            }
          >
            Target
            Temperature
          </Text>

          <View
            style={
              styles.stepRow
            }
          >
            <TouchableOpacity
              style={
                styles.stepButton
              }
              onPress={() =>
                setTemperature(
                  Math.max(
                    60,
                    temperature -
                      1
                  )
                )
              }
            >
              <Text
                style={
                  styles.stepText
                }
              >
                −
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.stepButton
              }
              onPress={() =>
                setTemperature(
                  Math.min(
                    95,
                    temperature +
                      1
                  )
                )
              }
            >
              <Text
                style={
                  styles.stepText
                }
              >
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={
            styles.statsCard
          }
        >
          <View
            style={
              styles.statItem
            }
          >
            <Feather
              name="home"
              size={
                22
              }
              color="#A4A8B8"
            />
            <View
              style={
                styles.statTextWrap
              }
            >
              <Text
                style={
                  styles.statLabel
                }
              >
                Room Temp
              </Text>
              <Text
                style={
                  styles.statValue
                }
              >
                71°F
              </Text>
            </View>
          </View>

          <View
            style={
              styles.statDivider
            }
          />

          <View
            style={
              styles.statItem
            }
          >
            <MaterialCommunityIcons
              name="fan"
              size={
                22
              }
              color="#A4A8B8"
            />
            <View
              style={
                styles.statTextWrap
              }
            >
              <Text
                style={
                  styles.statLabel
                }
              >
                Airflow
              </Text>
              <Text
                style={
                  styles.statValue
                }
              >
                {
                  fanSpeed
                }
                %
              </Text>
            </View>
          </View>
        </View>

        <Text
          style={
            styles.sectionTitle
          }
        >
          Modes
        </Text>

        <View
          style={
            styles.modeRow
          }
        >
          {modes.map(
            (
              item
            ) => {
              const active =
                mode ===
                item.key;

              return (
                <TouchableOpacity
                  key={
                    item.key
                  }
                  onPress={() =>
                    setMode(
                      item.key
                    )
                  }
                  style={[
                    styles.modeCard,
                    active &&
                      styles.modeCardActive,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={
                      item.icon
                    }
                    size={
                      28
                    }
                    color={
                      active
                        ? accent
                        : "#7C8295"
                    }
                  />

                  <Text
                    style={[
                      styles.modeCardText,
                      active &&
                        styles.modeCardTextActive,
                    ]}
                  >
                    {
                      item.label
                    }
                  </Text>
                </TouchableOpacity>
              );
            }
          )}
        </View>

        <View
          style={
            styles.fanCard
          }
        >
          <View
            style={
              styles.fanHeader
            }
          >
            <MaterialCommunityIcons
              name="fan"
              size={
                28
              }
              color={
                accent
              }
            />
            <Text
              style={
                styles.fanTitle
              }
            >
              Fan Speed
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
              value
            ) =>
              setFanSpeed(
                Math.round(
                  value
                )
              )
            }
          />

          <Text
            style={
              styles.fanPercent
            }
          >
            {
              fanSpeed
            }
            %
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles =
  StyleSheet.create(
    {
      root: {
        flex: 1,
        backgroundColor:
          "#020617",
      },

      content: {
        paddingTop: 70,
        paddingHorizontal: 20,
        paddingBottom: 140,
      },

      header: {
        flexDirection:
          "row",
        justifyContent:
          "space-between",
        alignItems:
          "center",
        marginBottom:
          24,
      },

      connectedRow:
        {
          flexDirection:
            "row",
          alignItems:
            "center",
        },

      greenDot: {
        width: 12,
        height: 12,
        borderRadius:
          6,
        backgroundColor:
          "#22E67D",
        marginRight:
          10,
      },

      connected: {
        color:
          "#FFF",
        fontSize: 18,
      },

      headerButtons:
        {
          flexDirection:
            "row",
          gap: 12,
        },

      headerCircle:
        {
          width: 52,
          height: 52,
          borderRadius:
            26,
          backgroundColor:
            "rgba(255,255,255,0.04)",
          borderWidth: 1,
          borderColor:
            "rgba(255,255,255,0.08)",
          justifyContent:
            "center",
          alignItems:
            "center",
        },

      blueDot: {
        position:
          "absolute",
        top: 10,
        right: 10,
        width: 10,
        height: 10,
        borderRadius:
          5,
        backgroundColor:
          "#1683FF",
      },

      dialBox: {
        alignItems:
          "center",
        height: 425,
      },

      knob: {
        position:
          "absolute",
        width: 30,
        height: 30,
        borderRadius:
          15,
        backgroundColor:
          "rgba(255,255,255,0.9)",
      },

      snowflake: {
        position: "absolute",
        top: 40,
      },

      modeLabel: {
        color:
          "#1683FF",
        fontSize: 22,
        position: "absolute",
        top: 100,
      },

      temp: {
        position: "absolute",
        top: 125,
        color:
          "#FFF",
        fontSize: 96,
        fontWeight:
          "300",
      },

      target: {
        color:
          "rgba(255,255,255,0.5)",
        marginTop:
          -6,
      },

      stepRow: {
        flexDirection:
          "row",
        gap: 42,
        marginTop:
          18,
      },

      stepButton:
        {
          width: 58,
          height: 58,
          borderRadius:
            29,
          backgroundColor:
            "rgba(255,255,255,0.05)",
          justifyContent:
            "center",
          alignItems:
            "center",
        },

      stepText: {
        color:
          "#FFF",
        fontSize: 32,
      },

      statsCard:
        {
          backgroundColor:
            "rgba(255,255,255,0.04)",
          borderRadius:
            26,
          padding: 20,
          flexDirection:
            "row",
          marginBottom:
            28,
        },

      statItem: {
        flex: 1,
        flexDirection:
          "row",
        alignItems:
          "center",
      },

      statTextWrap:
        {
          marginLeft:
            12,
        },

      statDivider:
        {
          width: 1,
          backgroundColor:
            "rgba(255,255,255,0.08)",
          marginHorizontal:
            18,
        },

      statLabel: {
        color:
          "rgba(255,255,255,0.55)",
      },

      statValue: {
        color:
          "#FFF",
        fontSize: 18,
      },

      sectionTitle:
        {
          color:
            "#FFF",
          fontSize: 24,
          marginBottom:
            16,
        },

      modeRow: {
        flexDirection:
          "row",
        gap: 12,
        marginBottom:
          24,
      },

      modeCard: {
        flex: 1,
        height: 120,
        borderRadius:
          22,
        backgroundColor:
          "rgba(255,255,255,0.04)",
        justifyContent:
          "center",
        alignItems:
          "center",
      },

      modeCardActive:
        {
          borderWidth: 1,
          borderColor:
            "#1683FF",
          backgroundColor:
            "rgba(22,131,255,0.08)",
        },

      modeCardText:
        {
          color:
            "#7C8295",
          textAlign:
            "center",
          marginTop:
            10,
        },

      modeCardTextActive:
        {
          color:
            "#FFF",
        },

      fanCard: {
        borderRadius:
          26,
        backgroundColor:
          "rgba(255,255,255,0.04)",
        padding: 20,
      },

      fanHeader:
        {
          flexDirection:
            "row",
          alignItems:
            "center",
          marginBottom:
            14,
        },

      fanTitle: {
        color:
          "#FFF",
        fontSize: 20,
        marginLeft:
          10,
      },

      fanPercent:
        {
          color:
            "#FFF",
          fontSize: 18,
          marginTop:
            10,
          textAlign:
            "right",
        },
    }
  );