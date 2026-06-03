import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// REPLACE ENTIRE SETTINGS_GROUPS WITH THIS

const SETTINGS_GROUPS = [
  {
    key: "preferences",
    items: [
      {
  key:
    "climate",
  icon:
    "thermometer",
  iconColor:
    "#60A5FA",
  iconBg:
    "rgba(96,165,250,0.12)",
  title:
    "Climate Preferences",
  subtitle:
    "Default settings and comfort preferences",
  screen:
    "ClimatePreferences",
},
      {
        key: "schedule",
        icon:
          "calendar-month-outline",
        iconColor: "#818CF8",
        iconBg:
          "rgba(129,140,248,0.12)",
        title:
          "Schedule Preferences",
        subtitle:
          "Control how schedules behave",
      },
      {
        key:
          "notifications",
        icon:
          "bell-outline",
        iconColor:
          "#A4A8B8",
        iconBg:
          "rgba(164,168,184,0.10)",
        title:
          "Notifications",
        subtitle:
          "Choose what you want to be notified about",
      },
      {
        key:
          "appearance",
        icon:
          "palette-outline",
        iconColor:
          "#A78BFA",
        iconBg:
          "rgba(167,139,250,0.10)",
        title:
          "Appearance",
        subtitle:
          "Theme, motion, and visual options",
        screen:
          "Appearance",
      },
      {
        key:
          "accessibility",
        icon:
          "human",
        iconColor:
          "#34D399",
        iconBg:
          "rgba(52,211,153,0.10)",
        title:
          "Accessibility",
        subtitle:
          "Make the app easier to read, use, and focus on",
      },
    ],
  },

  {
    key: "reliability",
    items: [
      {
        key:
          "heating",
        icon:
          "radiator",
        iconColor:
          "#F59E0B",
        iconBg:
          "rgba(245,158,11,0.10)",
        title:
          "Heating Reliability",
        subtitle:
          "Monitor heating performance and prevent cool-air output",
      },
    ],
  },

  {
    key: "device",
    items: [
      {
        key:
          "device",
        icon:
          "monitor-small",
        iconColor:
          "#A4A8B8",
        iconBg:
          "rgba(164,168,184,0.10)",
        title:
          "Device",
        subtitle:
          "Updates, actions, and device settings",
      },
      {
        key:
          "advanced",
        icon:
          "tools",
        iconColor:
          "#94A3B8",
        iconBg:
          "rgba(148,163,184,0.10)",
        title:
          "Advanced",
        subtitle:
          "Diagnostics, logs, resets, and developer tools",
      },
      {
        key:
          "about",
        icon:
          "information-outline",
        iconColor:
          "#A4A8B8",
        iconBg:
          "rgba(164,168,184,0.10)",
        title:
          "About",
        subtitle:
          "App info, support, and legal",
      },
    ],
  },

  {
    key: "danger",
    items: [
      {
        key:
          "reset",
        icon:
          "delete-outline",
        iconColor:
          "#EF4444",
        iconBg:
          "rgba(239,68,68,0.10)",
        title:
          "Factory Reset",
        subtitle:
          "Remove BedJet from your account",
        titleColor:
          "#EF4444",
      },
    ],
  },
];

function SettingsRow({ item, isFirst, isLast }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => item.screen && navigation.navigate(item.screen)}
      style={[
        styles.row,
        isFirst && styles.rowFirst,
        isLast  && styles.rowLast,
        !isLast && styles.rowBorder,
      ]}
      activeOpacity={0.7}
    >
      <View style={[styles.rowIcon, { backgroundColor: item.iconBg }]}>
        <MaterialCommunityIcons name={item.icon} size={22} color={item.iconColor} />
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, item.titleColor && { color: item.titleColor }]}>
          {item.title}
        </Text>
        <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.25)" />
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
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
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 34 }} />
        </View>

        {/* ── Device Card ── */}
        <TouchableOpacity style={styles.deviceCard} activeOpacity={0.8}>
          {/* Device image placeholder — replace with your actual BedJet image */}
          <View style={styles.deviceImageWrap}>
            <MaterialCommunityIcons name="air-humidifier" size={52} color="rgba(255,255,255,0.6)" />
          </View>

          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>BedJet 3</Text>
            <View style={styles.connectedRow}>
              <View style={styles.greenDot} />
              <Text style={styles.connectedText}>Connected</Text>
            </View>
            <View style={styles.deviceMetaRow}>
              <Ionicons name="home-outline" size={13} color="rgba(255,255,255,0.4)" />
              <Text style={styles.deviceMeta}> Bedroom</Text>
            </View>
            <Text style={styles.deviceMeta}>Firmware v2.4.1</Text>
            <Text style={styles.deviceMeta}>Last sync: Just now</Text>
          </View>

          <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.25)" style={{ alignSelf: "center" }} />
        </TouchableOpacity>

        {/* ── Settings Groups ── */}
        {SETTINGS_GROUPS.map(group => (
          <View key={group.key} style={styles.group}>
            {group.items.map((item, i) => (
              <SettingsRow
                key={item.key}
                item={item}
                isFirst={i === 0}
                isLast={i === group.items.length - 1}
              />
            ))}
          </View>
        ))}

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
    marginBottom: 24,
  },
  headerBack:  { padding: 4 },
  headerTitle: { color: "#FFF", fontSize: 28, fontWeight: "700" },

  // Device card
  deviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  deviceImageWrap: {
    width: 80,
    height: 80,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  deviceInfo:   { flex: 1 },
  deviceName:   { color: "#FFF", fontSize: 18, fontWeight: "700", marginBottom: 4 },
  connectedRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  greenDot:     { width: 8, height: 8, borderRadius: 4, backgroundColor: "#22E67D", marginRight: 6 },
  connectedText:{ color: "#22E67D", fontSize: 13, fontWeight: "600" },
  deviceMetaRow:{ flexDirection: "row", alignItems: "center" },
  deviceMeta:   { color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 2 },

  // Settings groups
  group: {
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  // Row
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowFirst:  { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  rowLast:   { borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)" },

  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  rowText:     { flex: 1 },
  rowTitle:    { color: "#FFF", fontSize: 16, fontWeight: "600", marginBottom: 2 },
  rowSubtitle: { color: "rgba(255,255,255,0.4)", fontSize: 13 },

});