import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useAppearance } from "../context/AppearanceContext";

const ACCENT_OPTIONS = [
  { key: "blue",    label: "Blue",    color: "#1683FF", description: "Classic cooling BedJet feel" },
  { key: "warm",    label: "Warm",    color: "#F59E0B", description: "Softer warmer tones for heating modes" },
  { key: "minimal", label: "Minimal", color: "#94A3B8", description: "Very subdued accents for a calmer experience" },
];

// Light → Dark → Auto (left to right)
const THEME_OPTIONS = [
  { key: "light",  label: "Light", icon: "white-balance-sunny"  },
  { key: "dark",   label: "Dark",  icon: "moon-waning-crescent" },
  { key: "system", label: "Auto",  icon: "circle-half-full"     },
];

export default function AppearanceScreen() {
  const navigation = useNavigation();
  const {
    theme,             setTheme,
    reduceMotion,      setReduceMotion,
    reduceGlow,        setReduceGlow,
    reduceVisualNoise, setReduceVisualNoise,
    calmMode,          handleCalmMode,
    highContrast,      setHighContrast,
    accentColor,       setAccentColor,
    accent,
    colors,
  } = useAppearance();

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <LinearGradient colors={colors.bgGrad} style={StyleSheet.absoluteFill} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBack} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={26} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Appearance</Text>
          <View style={{ width: 34 }} />
        </View>
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Theme, motion, and visual options
        </Text>

        {/* ── Theme ── */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>THEME</Text>
        <View style={[styles.group, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.themeRow}>
            {THEME_OPTIONS.map(opt => {
              const active = theme === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => setTheme(opt.key)}
                  activeOpacity={0.75}
                  style={[
                    styles.themeOption,
                    { backgroundColor: colors.card, borderColor: colors.cardBorder },
                    active && { backgroundColor: colors.accentFaded, borderColor: `${accent}66` },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={opt.icon}
                    size={20}
                    color={active ? accent : colors.textMuted}
                  />
                  <Text style={[
                    styles.themeLabel,
                    { color: colors.textMuted },
                    active && { color: accent, fontWeight: "600" },
                  ]}>
                    {opt.label}
                  </Text>
                  {active && <View style={[styles.themeActiveDot, { backgroundColor: accent }]} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Accent Color ── */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>ACCENT COLOR</Text>
        <View style={[styles.group, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          {ACCENT_OPTIONS.map((opt, i) => {
            const active = accentColor === opt.key;
            const isLast = i === ACCENT_OPTIONS.length - 1;
            return (
              <TouchableOpacity
                key={opt.key}
                onPress={() => setAccentColor(opt.key)}
                activeOpacity={0.75}
                style={[
                  styles.row,
                  !isLast && { borderBottomWidth: 1, borderBottomColor: colors.divider },
                  active && { backgroundColor: `${opt.color}08` },
                ]}
              >
                <View style={[styles.accentSwatch, { backgroundColor: opt.color }]} />
                <View style={styles.rowText}>
                  <Text style={[styles.rowTitle, { color: active ? colors.text : colors.textSub }]}>
                    {opt.label}
                  </Text>
                  <Text style={[styles.rowSubtitle, { color: colors.textMuted }]}>
                    {opt.description}
                  </Text>
                </View>
                {active && (
                  <View style={[styles.checkCircle, { backgroundColor: opt.color }]}>
                    <Ionicons name="checkmark" size={14} color="#FFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Calm Mode ── */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>CALM MODE</Text>
        <View style={[styles.group, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <ToggleRow
            icon="weather-night"
            iconColor="#818CF8"
            iconBg="rgba(129,140,248,0.12)"
            title="Calm Mode"
            subtitle="One-tap simplified experience for bedtime"
            tags={["ADHD", "Sensory", "Bedtime"]}
            value={calmMode}
            onValueChange={handleCalmMode}
            accent={accent}
            colors={colors}
            isLast
          />
        </View>
        {calmMode && (
          <View style={styles.calmNote}>
            <Ionicons name="information-circle-outline" size={15} color={colors.textMuted} />
            <Text style={[styles.calmNoteText, { color: colors.textMuted }]}>
              Calm Mode has enabled Reduce Motion, Reduce Glow, and Reduce Visual Noise.
            </Text>
          </View>
        )}

        {/* ── Accessibility ── */}
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>ACCESSIBILITY</Text>
        <View style={[styles.group, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <ToggleRow
            icon="run-fast"
            iconColor="#60A5FA"
            iconBg="rgba(96,165,250,0.12)"
            title="Reduce Motion"
            subtitle="Less bouncing, sliding, and animation throughout the app"
            tags={["ADHD", "Sensory", "Nighttime"]}
            value={reduceMotion}
            onValueChange={setReduceMotion}
            accent={accent}
            colors={colors}
          />
          <ToggleRow
            icon="lightbulb-outline"
            iconColor="#FCD34D"
            iconBg="rgba(252,211,77,0.10)"
            title="Reduce Glow"
            subtitle="Softer highlights, less neon, muted accents"
            tags={["Night use", "Eye strain"]}
            value={reduceGlow}
            onValueChange={setReduceGlow}
            accent={accent}
            colors={colors}
          />
          <ToggleRow
            icon="eye-outline"
            iconColor="#34D399"
            iconBg="rgba(52,211,153,0.10)"
            title="Reduce Visual Noise"
            subtitle="Fewer labels, cleaner cards, less visual density"
            tags={["ADHD", "Focus"]}
            value={reduceVisualNoise}
            onValueChange={setReduceVisualNoise}
            accent={accent}
            colors={colors}
          />
          <ToggleRow
            icon="contrast-circle"
            iconColor="#E2E8F0"
            iconBg="rgba(226,232,240,0.10)"
            title="High Contrast"
            subtitle="Stronger text contrast and clearer boundaries"
            tags={["Vision", "Readability"]}
            value={highContrast}
            onValueChange={setHighContrast}
            accent={accent}
            colors={colors}
            isLast
          />
        </View>

      </ScrollView>
    </View>
  );
}

function ToggleRow({ icon, iconColor, iconBg, title, subtitle, tags, value, onValueChange, accent, colors, isLast }) {
  return (
    <View style={[
      styles.row,
      styles.toggleRow,
      !isLast && { borderBottomWidth: 1, borderBottomColor: colors.divider },
    ]}>
      <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons name={icon} size={21} color={iconColor} />
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.rowSubtitle, { color: colors.textMuted }]}>{subtitle}</Text>
        {tags && (
          <View style={styles.tagRow}>
            {tags.map(t => (
              <View key={t} style={[styles.tag, { backgroundColor: colors.card }]}>
                <Text style={[styles.tagText, { color: colors.textMuted }]}>{t}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "rgba(255,255,255,0.12)", true: accent }}
        thumbColor="#FFF"
        style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1 },
  content: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 120 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  headerBack:  { padding: 4 },
  headerTitle: { fontSize: 28, fontWeight: "700" },
  subtitle:    { fontSize: 14, marginBottom: 28 },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 8,
    marginLeft: 4,
  },

  group: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    marginBottom: 24,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  toggleRow:   { alignItems: "flex-start", paddingVertical: 16 },
  rowText:     { flex: 1, marginRight: 8 },
  rowTitle:    { fontSize: 15, fontWeight: "600", marginBottom: 2 },
  rowSubtitle: { fontSize: 13, lineHeight: 18 },

  themeRow: {
    flexDirection: "row",
    padding: 12,
    gap: 10,
  },
  themeOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  themeLabel:     { fontSize: 12, fontWeight: "500" },
  themeActiveDot: { width: 5, height: 5, borderRadius: 3, marginTop: 2 },

  accentSwatch: {
    width: 28, height: 28, borderRadius: 8, marginRight: 14,
  },
  checkCircle: {
    width: 26, height: 26, borderRadius: 13,
    justifyContent: "center", alignItems: "center",
  },

  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  tag:    { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  tagText:{ fontSize: 11, fontWeight: "500" },

  iconWrap: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: "center", alignItems: "center",
    marginRight: 14, marginTop: 2,
  },

  calmNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: -16,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  calmNoteText: { flex: 1, fontSize: 12, lineHeight: 17 },
});