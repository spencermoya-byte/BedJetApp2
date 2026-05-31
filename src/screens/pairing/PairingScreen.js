import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from "react-native";

import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { mockBluetoothService } from "../../services/bluetooth/mockBluetoothService";

const { height } = Dimensions.get("window");

export default function PairingScreen({
  onPairSuccess,
}) {
  const [device, setDevice] =
    useState(null);

  const [connecting, setConnecting] =
    useState(false);

  const slideAnim = useRef(
    new Animated.Value(height)
  ).current;

  const fadeAnim = useRef(
    new Animated.Value(0)
  ).current;

  const floatAnim = useRef(
    new Animated.Value(0)
  ).current;

  useEffect(() => {
    scanForDevice();

    Animated.loop(
      Animated.sequence([
        Animated.timing(
          floatAnim,
          {
            toValue: -8,
            duration: 2200,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          floatAnim,
          {
            toValue: 0,
            duration: 2200,
            useNativeDriver: true,
          }
        ),
      ])
    ).start();
  }, []);

  const scanForDevice =
    async () => {
      const found =
        await mockBluetoothService.scanForDevice();

      setDevice(found);

      Animated.parallel([
        Animated.spring(
          slideAnim,
          {
            toValue: 0,
            damping: 18,
            stiffness: 120,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }
        ),
      ]).start();
    };

  const handleConnect =
    async () => {
      setConnecting(true);

      await mockBluetoothService.connect();

      onPairSuccess();
    };

  if (!device) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>
          Searching for BedJet...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Bedroom Background */}
      <Image
        source={require("../../assets/images/bedroom-bg.jpg")}
        style={styles.background}
        blurRadius={8}
      />

      <View style={styles.overlay} />

      <Animated.View
  style={{
    transform: [
      {
        translateY:
          floatAnim,
      },
    ],

    shadowColor: "#6E63FF",
    shadowOpacity: 0.18,
    shadowRadius: 28,
    shadowOffset: {
      width: 0,
      height: 20,
    },

    elevation: 16,
  }}
>
        <BlurView
          intensity={25}
          tint="light"
          style={styles.card}
        >
          {/* Close */}
          <TouchableOpacity
            style={styles.closeButton}
          >
            <Text
              style={styles.closeText}
            >
              ✕
            </Text>
          </TouchableOpacity>

          {/* Dynamic Model */}
          <Text style={styles.title}>
            {device.modelName}
          </Text>

          <View style={styles.tag}>
            <Text
              style={styles.tagText}
            >
              ✦ Climate Comfort for
              Better Sleep
            </Text>
          </View>

          {/* Floating Product */}
          <Animated.View
            style={{
              transform: [
                {
                  translateY:
                    floatAnim,
                },
              ],
            }}
          >
            <Image
              source={
                device.image
              }
              style={
                styles.productImage
              }
              resizeMode="contain"
            />
          </Animated.View>

          <Text
            style={styles.status}
          >
            {connecting
              ? "Connecting..."
              : "Ready to Pair"}
          </Text>

          {/* Status Row */}
          <View
            style={styles.infoCard}
          >
            <View
              style={
                styles.infoItem
              }
            >
             <Ionicons
  name="bluetooth"
  size={34}
  color="#4F46E5"
/>

              <Text
                style={
                  styles.infoTitle
                }
              >
                Bluetooth
              </Text>

              <Text
                style={
                  styles.infoValue
                }
              >
                On
              </Text>
            </View>

            <View
              style={
                styles.divider
              }
            />

            <View
              style={
                styles.infoItem
              }
            >
              <Ionicons
  name="cellular"
  size={30}
  color="#4F46E5"
/>

              <Text
                style={
                  styles.infoTitle
                }
              >
                Signal
              </Text>

              <Text
                style={
                  styles.signal
                }
              >
                Strong
              </Text>
            </View>

            <View
              style={
                styles.divider
              }
            />

            <View
              style={
                styles.infoItem
              }
            >
              <Ionicons
  name="flash"
  size={30}
  color="#F59E0B"
/>

              <Text
                style={
                  styles.infoTitle
                }
              >
                Power
              </Text>

              <Text
                style={
                  styles.infoValue
                }
              >
                AC Powered
              </Text>
            </View>
          </View>

          {/* Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={
              handleConnect
            }
          >
            <Text
              style={
                styles.buttonText
              }
            >
              {connecting
                ? "Connecting..."
                : "Connect"}
            </Text>
          </TouchableOpacity>

          <View
            style={styles.homeBar}
          />
        </BlurView>
      </Animated.View>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent:
        "flex-end",
    },

    background: {
      ...StyleSheet.absoluteFillObject,
    },

    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor:
        "rgba(0,0,0,0.28)",
    },

    loading: {
      flex: 1,
      justifyContent:
        "center",
      alignItems: "center",
      backgroundColor:
        "#000",
    },

    loadingText: {
      color: "#FFF",
      fontSize: 18,
    },

    modalContainer: {
      paddingHorizontal: 12,
      paddingBottom: 14,
    },

    card: {
      borderRadius: 42,
      paddingTop: 28,
      paddingHorizontal: 24,
      paddingBottom: 16,
      overflow: "hidden",
      backgroundColor:
        "rgba(255,255,255,0.90)",
    },

    closeButton: {
      position: "absolute",
      top: 22,
      right: 22,
      zIndex: 10,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor:
        "#ECECF1",
      justifyContent:
        "center",
      alignItems: "center",
    },

    closeText: {
      fontSize: 22,
      color: "#444",
    },

    title: {
      fontSize: 34,
      fontWeight: "700",
      textAlign: "center",
      color: "#000",
    },

    tag: {
      alignSelf: "center",
      backgroundColor:
        "#F3F2FF",
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 999,
      marginTop: 14,
    },

    tagText: {
      color: "#666",
      fontSize: 15,
    },

    productImage: {
  width: 520,
  height: 320,
  alignSelf: "center",
  marginTop: -100,
  marginBottom: -10,
},

    status: {
  textAlign: "center",
  fontSize: 22,
  fontWeight: "600",
  color: "#2E2E38",
  marginTop: -30,
  marginBottom: 30,
},

    infoCard: {
      flexDirection: "row",
      backgroundColor:
        "#F8F8FA",
      borderRadius: 28,
      paddingVertical: 18,
      marginBottom: 20,
      alignItems: "center",
    },

    infoItem: {
      flex: 1,
      alignItems: "center",
    },

    divider: {
      width: 1,
      height: 56,
      backgroundColor:
        "#E7E7EC",
    },

    infoIcon: {
      fontSize: 26,
    },

    infoTitle: {
      fontSize: 15,
      fontWeight: "600",
      marginTop: 4,
      color: "#111",
    },

    infoValue: {
      color: "#4A6CF7",
      marginTop: 2,
    },

    signal: {
      color: "#4F46E5",
      fontWeight: "700",
      marginTop: 2,
    },

    button: {
      backgroundColor:
        "#5A5CFF",
      borderRadius: 28,
      paddingVertical: 22,
      alignItems: "center",
      shadowColor: "#5A5CFF",
      shadowOpacity: 0.35,
      shadowRadius: 22,
      shadowOffset: {
        width: 0,
        height: 8,
      },
    },

    buttonText: {
      color: "#FFF",
      fontSize: 22,
      fontWeight: "700",
    },

    homeBar: {
      width: 140,
      height: 5,
      borderRadius: 99,
      backgroundColor:
        "#111",
      alignSelf: "center",
      marginTop: 18,
    },
  });