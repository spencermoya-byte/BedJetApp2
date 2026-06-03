import React, { useState } from "react";
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
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";
import { useAppearance } from "../context/AppearanceContext";

const { width } = Dimensions.get("window");

const dialSize    = width * 0.74;
const strokeWidth = 10;
const radius      = (dialSize - strokeWidth) / 2;
const center      = dialSize / 2;
const knobSize    = 30;

const ARC_START = 130;
const ARC_SPAN  = 280;
const ARC_END   = ARC_START + ARC_SPAN;

const MODE_TEMPS = {
  cool:  { min: 60, max: 80  },
  dry:   { min: 60, max: 85  },
  turbo: { min: 60, max: 109 },
  off:   { min: 60, max: 95  },
};

const circumference    = 2 * Math.PI * radius;
const visibleArcLength = circumference * (ARC_SPAN / 360);

function tempToNorm(t, min, max) { return (t - min) / (max - min); }
function normToTemp(n, min, max) { return Math.round(min + n * (max - min)); }

function knobPos(norm) {
  const deg = ARC_START + norm * ARC_SPAN;
  const rad = (deg * Math.PI) / 180;
  return { x: center + radius * Math.cos(rad), y: center + radius * Math.sin(rad) };
}

export default function HomeScreen() {
  const { reduceVisualNoise } = useAppearance();

  const [temperature, setTemperature] = useState(72);
  const [fanSpeed,    setFanSpeed]    = useState(55);
  const [mode,        setMode]        = useState("cool");
  const [isDragging,  setIsDragging]  = useState(false);
  const [svgLayout,   setSvgLayout]   = useState(null);

  const { min: MIN_TEMP, max: MAX_TEMP } = MODE_TEMPS[mode];
  const norm = tempToNorm(temperature, MIN_TEMP, MAX_TEMP);
  const { x: kx, y: ky } = knobPos(norm);

  const accent =
    mode === "cool"  ? "#1683FF" :
    mode === "turbo" ? "#F59E0B" :
    mode === "dry"   ? "#38BDF8" : "#6B7280";

  function applyTouch(touchX, touchY) {
    if (!svgLayout) return;
    const dx = touchX - (svgLayout.x + center);
    const dy = touchY - (svgLayout.y + center);
    let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (angleDeg < ARC_START) angleDeg += 360;
    angleDeg = Math.max(ARC_START, Math.min(ARC_END, angleDeg));
    const n = (angleDeg - ARC_START) / ARC_SPAN;
    setTemperature(normToTemp(n, MIN_TEMP, MAX_TEMP));
  }

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder:  () => true,
    onPanResponderGrant:    (_, g) => { setIsDragging(true); applyTouch(g.x0, g.y0); },
    onPanResponderMove:     (_, g) => { applyTouch(g.moveX, g.moveY); },
    onPanResponderRelease:  ()     => setIsDragging(false),
    onPanResponderTerminate:()     => setIsDragging(false),
  });

  function adjustTemp(delta) {
    setTemperature(t => Math.max(MIN_TEMP, Math.min(MAX_TEMP, t + delta)));
  }

  function switchMode(newMode) {
    const { min, max } = MODE_TEMPS[newMode];
    setTemperature(t => Math.max(min, Math.min(max, t)));
    setMode(newMode);
  }

  const modeLabel =
    mode === "off"   ? "OFF"        :
    mode === "turbo" ? "TURBO HEAT" :
    mode === "dry"   ? "DRY MODE"   : "COOL MODE";

  const modeIcon =
    mode === "off"   ? "power"         :
    mode === "turbo" ? "fire"          :
    mode === "dry"   ? "water-outline" : "snowflake";

  const modes = [
    { key: "off",   label: "OFF",         icon: "power"         },
    { key: "turbo", label: "TURBO\nHEAT", icon: "fire"          },
    { key: "cool",  label: "COOL",        icon: "snowflake"     },
    { key: "dry",   label: "DRY\nMODE",   icon: "water-outline" },
  ];

  return (
    <View style={styles.root}>
      <LinearGradient colors={["#020617","#020712","#06101F"]} style={StyleSheet.absoluteFill} />

      <ScrollView
        scrollEnabled={!isDragging}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.connectedRow}>
            <View style={styles.greenDot} />
            <Text style={styles.connected}>BedJet 3 Connected</Text>
          </View>
          {/* RVN: hide secondary header buttons */}
          {!reduceVisualNoise && (
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.headerCircle}>
                <Ionicons name="notifications-outline" size={24} color="#FFF" />
                <View style={styles.blueDot} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerCircle}>
                <Ionicons name="settings-outline" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Dial */}
        <View style={styles.dialBox}>
          <View
            style={{ width: dialSize, height: dialSize }}
            onLayout={(e) => {
              e.target.measure((x, y, w, h, pageX, pageY) => {
                setSvgLayout({ x: pageX, y: pageY });
              });
            }}
          >
            <Svg width={dialSize} height={dialSize}>
              <Circle
                cx={center} cy={center} r={radius}
                stroke={accent}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={[visibleArcLength * norm, circumference]}
                rotation={ARC_START}
                origin={`${center}, ${center}`}
                strokeLinecap="round"
              />
            </Svg>

            <View
              {...panResponder.panHandlers}
              style={[styles.knobHitArea, { left: kx - 30, top: ky - 30 }]}
            >
              <View style={[
                styles.knobCapsule,
                { transform: [{ rotate: `${ARC_START + norm * ARC_SPAN}deg` }] },
                isDragging ? styles.knobCapsuleActive : styles.knobCapsuleSolid,
              ]}>
                {isDragging && <View style={styles.knobShine} />}
              </View>
            </View>
          </View>

          <View style={styles.dialContent} pointerEvents="none">
            <MaterialCommunityIcons name={modeIcon} size={42} color={accent} />
            {/* RVN: hide mode label text */}
            {!reduceVisualNoise && (
              <Text style={[styles.modeLabel, { color: accent }]}>{modeLabel}</Text>
            )}
            <Text style={styles.temp}>{temperature}°</Text>
            {/* RVN: hide "Target Temperature" sub-label */}
            {!reduceVisualNoise && (
              <Text style={styles.target}>Target Temperature</Text>
            )}
          </View>

          <View style={styles.stepRow}>
            <TouchableOpacity style={styles.stepButton} onPress={() => adjustTemp(-1)}>
              <Text style={styles.stepText}>−</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.stepButton} onPress={() => adjustTemp(1)}>
              <Text style={styles.stepText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats — RVN: show only temp value, hide airflow label */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Feather name="home" size={22} color="#A4A8B8" />
            <View style={styles.statTextWrap}>
              {!reduceVisualNoise && <Text style={styles.statLabel}>Room Temp</Text>}
              <Text style={styles.statValue}>71°F</Text>
            </View>
          </View>
          {/* RVN: hide the airflow stat entirely */}
          {!reduceVisualNoise && (
            <>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="fan" size={22} color="#A4A8B8" />
                <View style={styles.statTextWrap}>
                  <Text style={styles.statLabel}>Airflow</Text>
                  <Text style={styles.statValue}>{fanSpeed}%</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Modes — RVN: hide label text inside cards */}
        {!reduceVisualNoise && <Text style={styles.sectionTitle}>Modes</Text>}
        <View style={styles.modeRow}>
          {modes.map((item) => {
            const active = mode === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => switchMode(item.key)}
                style={[
                  styles.modeCard,
                  reduceVisualNoise && styles.modeCardCompact,
                  active && { borderWidth: 1, borderColor: accent, backgroundColor: `${accent}15` },
                ]}
              >
                <MaterialCommunityIcons name={item.icon} size={28} color={active ? accent : "#7C8295"} />
                {/* RVN: hide mode card text labels */}
                {!reduceVisualNoise && (
                  <Text style={[styles.modeCardText, active && styles.modeCardTextActive]}>
                    {item.label}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Fan Speed — RVN: hide title and percentage label */}
        <View style={styles.fanCard}>
          {!reduceVisualNoise && (
            <View style={styles.fanHeader}>
              <MaterialCommunityIcons name="fan" size={28} color={accent} />
              <Text style={styles.fanTitle}>Fan Speed</Text>
            </View>
          )}
          <Slider
            minimumValue={0} maximumValue={100} value={fanSpeed}
            minimumTrackTintColor={accent}
            maximumTrackTintColor="rgba(255,255,255,0.12)"
            thumbTintColor={accent}
            onValueChange={(v) => setFanSpeed(Math.round(v))}
          />
          {!reduceVisualNoise && (
            <Text style={styles.fanPercent}>{fanSpeed}%</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: "#020617" },
  content: { paddingTop: 70, paddingHorizontal: 20, paddingBottom: 140 },

  header:        { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  connectedRow:  { flexDirection: "row", alignItems: "center" },
  greenDot:      { width: 12, height: 12, borderRadius: 6, backgroundColor: "#22E67D", marginRight: 10 },
  connected:     { color: "#FFF", fontSize: 18 },
  headerButtons: { flexDirection: "row", gap: 12 },
  headerCircle:  { width: 52, height: 52, borderRadius: 26, backgroundColor: "rgba(255,255,255,0.04)", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", justifyContent: "center", alignItems: "center" },
  blueDot:       { position: "absolute", top: 10, right: 10, width: 10, height: 10, borderRadius: 5, backgroundColor: "#1683FF" },

  dialBox:     { alignItems: "center", marginBottom: 24 },
  dialContent: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center", paddingBottom: 60 },
  modeLabel:   { fontSize: 18, marginTop: 8 },
  temp:        { color: "#FFF", fontSize: 88, fontWeight: "300", lineHeight: 96 },
  target:      { color: "rgba(255,255,255,0.5)", fontSize: 14 },

  stepRow:    { flexDirection: "row", gap: 42, marginTop: 16 },
  stepButton: { width: 58, height: 58, borderRadius: 29, backgroundColor: "rgba(255,255,255,0.05)", justifyContent: "center", alignItems: "center" },
  stepText:   { color: "#FFF", fontSize: 32 },

  knobHitArea:      { position: "absolute", width: 60, height: 60, justifyContent: "center", alignItems: "center" },
  knobCapsule:      { width: 14, height: 36, borderRadius: 7, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 6, elevation: 8 },
  knobCapsuleSolid: { backgroundColor: "#FFFFFF" },
  knobCapsuleActive:{ backgroundColor: "rgba(255,255,255,0.18)", borderWidth: 1, borderColor: "rgba(255,255,255,0.75)" },
  knobShine:        { position: "absolute", top: 2, left: 2, right: 2, height: "45%", borderRadius: 5, backgroundColor: "rgba(255,255,255,0.45)" },

  statsCard:    { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 26, padding: 20, flexDirection: "row", marginBottom: 28 },
  statItem:     { flex: 1, flexDirection: "row", alignItems: "center" },
  statTextWrap: { marginLeft: 12 },
  statDivider:  { width: 1, backgroundColor: "rgba(255,255,255,0.08)", marginHorizontal: 18 },
  statLabel:    { color: "rgba(255,255,255,0.55)" },
  statValue:    { color: "#FFF", fontSize: 18 },

  sectionTitle:       { color: "#FFF", fontSize: 24, marginBottom: 16 },
  modeRow:            { flexDirection: "row", gap: 12, marginBottom: 24 },
  modeCard:           { flex: 1, height: 120, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.04)", justifyContent: "center", alignItems: "center" },
  modeCardCompact:    { height: 64 },
  modeCardText:       { color: "#7C8295", textAlign: "center", marginTop: 10 },
  modeCardTextActive: { color: "#FFF" },

  fanCard:    { borderRadius: 26, backgroundColor: "rgba(255,255,255,0.04)", padding: 20 },
  fanHeader:  { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  fanTitle:   { color: "#FFF", fontSize: 20, marginLeft: 10 },
  fanPercent: { color: "#FFF", fontSize: 18, marginTop: 10, textAlign: "right" },
});