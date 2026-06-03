import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAppearance } from "../context/AppearanceContext";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Polyline, Circle as SvgCircle } from "react-native-svg";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;

// ── Temperature sparkline data for Sleep Climate card ──────────────────────
// Points: [10PM=72, 12AM=70, 4AM=68, 6:30AM=68, 7AM=warm]
const SPARK_LABELS = ["10PM", "12AM", "4AM", "6:30AM", "7AM"];
const SPARK_TEMPS  = [72, 70, 68, 68, 76];
const SPARK_W      = CARD_WIDTH - 40;
const SPARK_H      = 48;
const SPARK_MIN    = 66;
const SPARK_MAX    = 78;

function sparkX(i) {
  return (i / (SPARK_TEMPS.length - 1)) * SPARK_W;
}
function sparkY(temp) {
  return SPARK_H - ((temp - SPARK_MIN) / (SPARK_MAX - SPARK_MIN)) * SPARK_H;
}

const COOL_POINTS = SPARK_TEMPS.slice(0, 4)
  .map((t, i) => `${sparkX(i)},${sparkY(t)}`)
  .join(" ");

const WARM_POINTS = SPARK_TEMPS.slice(3)
  .map((t, i) => `${sparkX(i + 3)},${sparkY(t)}`)
  .join(" ");

// ── Quick Presets ──────────────────────────────────────────────────────────
const PRESETS = [
  { key: "sleep",    label: "Sleep",     icon: "moon-waning-crescent",          color: "#1683FF", bg: "rgba(22,131,255,0.18)" },
  { key: "preheat",  label: "Preheat",   icon: "fire",          color: "#F59E0B", bg: "transparent" },
  { key: "cooldown", label: "Cool Down", icon: "snowflake",     color: "#A4A8B8", bg: "transparent" },
  { key: "nap",      label: "Nap",       icon: "sofa-single",          color: "#A4A8B8", bg: "transparent" },
  { key: "custom",   label: "Custom",    icon: "plus",          color: "#A4A8B8", bg: "transparent" },
];

// ── Schedule list items ────────────────────────────────────────────────────
const INITIAL_SCHEDULES = [
  {
    key: "sleep",
    title: "Sleep Climate",
    subtitle: "Active • Every Day",
    time: "10:00 PM – 7:00 AM",
    icon: "moon-waning-crescent",
    iconColor: "#1683FF",
    iconBg: "rgba(22,131,255,0.18)",
    enabled: true,
    expanded: true,
    stats: [
      { icon: "snowflake",  label: "72°  Cool" },
      { icon: "fan",        label: "50%" },
      { icon: "fire",       label: "Warm Wake" },
    ],
  },
  {
    key: "preheat",
    title: "Preheat Bed",
    subtitle: "Weekdays",
    time: "5:30 AM – 6:30 AM",
    icon: "fire",
    iconColor: "#F59E0B",
    iconBg: "rgba(245,158,11,0.18)",
    enabled: false,
    expanded: false,
  },
  {
    key: "cooldown",
    title: "Cool Down",
    subtitle: "Weekends",
    time: "1:00 PM – 3:30 PM",
    icon: "snowflake",
    iconColor: "#38BDF8",
    iconBg: "rgba(56,189,248,0.18)",
    enabled: false,
    expanded: false,
  },
  {
    key: "nap",
    title: "Nap Time",
    subtitle: "Every Day",
    time: "2:00 PM – 4:00 PM",
    icon: "sofa-single",
    iconColor: "#34D399",
    iconBg: "rgba(52,211,153,0.18)",
    enabled: false,
    expanded: false,
  },
];

export default function ScheduleScreen() {
  const { reduceVisualNoise } = useAppearance();
  const [activePreset, setActivePreset] = useState("sleep");
  const [schedules, setSchedules]       = useState(INITIAL_SCHEDULES);

  function toggleSchedule(key) {
    setSchedules(s =>
      s.map(item => item.key === key ? { ...item, enabled: !item.enabled } : item)
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#020617", "#020712", "#06101F"]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBack}>
            <Ionicons name="chevron-back" size={26} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Schedules</Text>
          <TouchableOpacity style={styles.headerAdd}>
            <Ionicons name="add" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>

        {!reduceVisualNoise && (
          <Text style={styles.subtitle}>
            Automate your BedJet climate{"\n"}throughout the night or day.
          </Text>
        )}

        {/* ── Quick Presets — hidden in RVN ── */}
        {!reduceVisualNoise && (
        <>
        <Text style={styles.sectionTitle}>Quick Presets</Text>
        <View style={styles.presetsRow}>
          {PRESETS.map(p => {
            const active = activePreset === p.key;
            return (
              <TouchableOpacity
                key={p.key}
                onPress={() => setActivePreset(p.key)}
                style={[
                  styles.presetItem,
                  active && styles.presetItemActive,
                ]}
              >
                <View style={[
                  styles.presetIconWrap,
                  { backgroundColor: active ? p.bg : "transparent" },
                ]}>
                  <MaterialCommunityIcons
                    name={p.icon}
                    size={26}
                    color={active ? p.color : "rgba(255,255,255,0.5)"}
                  />
                </View>
                <Text style={[
                  styles.presetLabel,
                  active && styles.presetLabelActive,
                ]}>
                  {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        </>
        )}

        {/* ── My Schedules header ── */}
        <View style={styles.schedulesHeader}>
          <Text style={styles.sectionTitle}>My Schedules</Text>
          <TouchableOpacity>
            <Text style={styles.editBtn}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* ── Schedule Cards ── */}
        {schedules.map(item => (
          <View key={item.key} style={styles.scheduleCard}>
            {item.expanded ? (
              // Expanded card (Sleep Climate)
              <>
                <View style={styles.cardRow}>
                  <View style={[styles.scheduleIconWrap, { backgroundColor: item.iconBg }]}>
                    <MaterialCommunityIcons name={item.icon} size={26} color={item.iconColor} />
                  </View>
                  <View style={styles.cardMeta}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <View style={styles.cardSubRow}>
                      <View style={styles.activeDot} />
                      <Text style={styles.cardSub}>{item.subtitle}</Text>
                    </View>
                    <View style={styles.cardTimeRow}>
                      <Ionicons name="time-outline" size={13} color="rgba(255,255,255,0.4)" />
                      <Text style={styles.cardTime}> {item.time}</Text>
                    </View>
                  </View>
                  <Switch
                    value={item.enabled}
                    onValueChange={() => toggleSchedule(item.key)}
                    trackColor={{ false: "rgba(255,255,255,0.12)", true: "#1683FF" }}
                    thumbColor="#FFF"
                    style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
                  />
                </View>

                {/* Sparkline chart — hidden in RVN */}
                {!reduceVisualNoise && <View style={styles.sparkWrap}>
                  <View style={styles.sparkTempLabels}>
                    <Text style={styles.sparkTempLabel}>72°</Text>
                    <Text style={[styles.sparkTempLabel, { color: "#F59E0B", marginLeft: "auto" }]}>Warm</Text>
                  </View>
                  <Text style={[styles.sparkTempLabel, { marginBottom: 4 }]}>68°</Text>

                  <Svg width={SPARK_W} height={SPARK_H + 4}>
                    {/* Cool segment (blue) */}
                    <Polyline
                      points={COOL_POINTS}
                      fill="none"
                      stroke="#1683FF"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                    {/* Warm segment (orange) */}
                    <Polyline
                      points={WARM_POINTS}
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                    {/* Dots */}
                    {SPARK_TEMPS.map((t, i) => (
                      <SvgCircle
                        key={i}
                        cx={sparkX(i)}
                        cy={sparkY(t)}
                        r={i === 0 || i === SPARK_TEMPS.length - 1 ? 5 : 4}
                        fill={i >= 3 ? "#F59E0B" : "#1683FF"}
                      />
                    ))}
                  </Svg>

                  {/* Time labels */}
                  <View style={styles.sparkLabelsRow}>
                    {SPARK_LABELS.map((l, i) => (
                      <Text key={i} style={styles.sparkLabel}>{l}</Text>
                    ))}
                  </View>
                </View>}

                {/* Stats row — hidden in RVN */}
                {!reduceVisualNoise && <View style={styles.statsRow}>
                  {item.stats.map((s, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <View style={styles.statsDivider} />}
                      <View style={styles.statItem}>
                        <MaterialCommunityIcons name={s.icon} size={16} color="rgba(255,255,255,0.55)" />
                        <Text style={styles.statText}>{s.label}</Text>
                      </View>
                    </React.Fragment>
                  ))}
                  <TouchableOpacity style={styles.statsArrow}>
                    <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.4)" />
                  </TouchableOpacity>
                </View>}
              </>
            ) : (
              // Collapsed card
              <View style={styles.cardRow}>
                <View style={[styles.scheduleIconWrap, { backgroundColor: item.iconBg }]}>
                  <MaterialCommunityIcons name={item.icon} size={26} color={item.iconColor} />
                </View>
                <View style={styles.cardMeta}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  {!reduceVisualNoise && <Text style={styles.cardSub}>{item.subtitle}</Text>}
                  {!reduceVisualNoise && <Text style={styles.cardTime}>{item.time}</Text>}
                </View>
                <Switch
                  value={item.enabled}
                  onValueChange={() => toggleSchedule(item.key)}
                  trackColor={{ false: "rgba(255,255,255,0.12)", true: "#1683FF" }}
                  thumbColor="#FFF"
                  style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
                />
                <TouchableOpacity style={{ marginLeft: 4 }}>
                  <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.3)" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {/* ── Footer note — hidden in RVN ── */}
        {!reduceVisualNoise && <View style={styles.footerNote}>
          <MaterialCommunityIcons name="calendar-multiselect" size={28} color="rgba(255,255,255,0.3)" />
          <View style={{ marginLeft: 14, flex: 1 }}>
            <Text style={styles.footerTitle}>Schedules run automatically</Text>
            <Text style={styles.footerSub}>
              BedJet will follow your plan and adjust temperature, fan speed, and mode.
            </Text>
          </View>
        </View>}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: "#020617" },
  content: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 120 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerBack:  { padding: 4 },
  headerAdd:   { padding: 4 },
  headerTitle: { color: "#FFF", fontSize: 28, fontWeight: "700" },

  subtitle: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 28,
  },

  sectionTitle: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 14,
  },

  // Quick Presets
  presetsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 20,
    padding: 12,
    marginBottom: 32,
  },
  presetItem: {
    alignItems: "center",
    flex: 1,
  },
  presetItemActive: {},
  presetIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  presetLabel: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 11,
    textAlign: "center",
  },
  presetLabelActive: {
    color: "#FFF",
    fontWeight: "600",
  },

  // My Schedules header
  schedulesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  editBtn: {
    color: "#1683FF",
    fontSize: 16,
  },

  // Schedule cards
  scheduleCard: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  scheduleIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  cardMeta: { flex: 1 },
  cardTitle: { color: "#FFF", fontSize: 17, fontWeight: "600", marginBottom: 3 },
  cardSubRow: { flexDirection: "row", alignItems: "center", marginBottom: 2 },
  activeDot:  { width: 7, height: 7, borderRadius: 4, backgroundColor: "#1683FF", marginRight: 6 },
  cardSub:    { color: "rgba(255,255,255,0.5)", fontSize: 13 },
  cardTimeRow:{ flexDirection: "row", alignItems: "center", marginTop: 2 },
  cardTime:   { color: "rgba(255,255,255,0.4)", fontSize: 13 },

  // Sparkline
  sparkWrap: {
    marginTop: 16,
    paddingHorizontal: 4,
  },
  sparkTempLabels: {
    flexDirection: "row",
    marginBottom: 2,
  },
  sparkTempLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
  },
  sparkLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  sparkLabel: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 11,
  },

  // Stats row inside expanded card
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },
  statsDivider: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginHorizontal: 12,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
  },
  statsArrow: {
    marginLeft: "auto",
  },

  // Footer note
  footerNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 20,
    padding: 18,
    marginTop: 8,
  },
  footerTitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  footerSub: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 13,
    lineHeight: 19,
  },
});