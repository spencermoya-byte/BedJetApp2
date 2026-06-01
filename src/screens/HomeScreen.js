import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import Slider from "@react-native-community/slider";
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [temperature, setTemperature] = useState(72);
  const [fanSpeed, setFanSpeed] = useState(55);
  const [mode, setMode] = useState("cool");

  const accent = "#1683FF";

  const modes = [
    ["OFF", "System Off", "power", "#5E6573"],
    ["TURBO HEAT", "Maximum Heat", "heat-wave", "#9A6A32"],
    ["EXT HEAT", "Extended Heat", "heat-wave", "#9A6A32"],
    ["COOL", "Cooling", "snowflake", accent],
    ["DRY MODE", "Reduce Moisture", "water-outline", "#3B3F4C"],
  ];

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
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Evening 👋</Text>
            <View style={styles.connectedRow}>
              <View style={styles.greenDot} />
              <Text style={styles.connected}>BedJet 3 Connected</Text>
            </View>
          </View>

          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.headerCircle}>
              <Ionicons name="notifications-outline" size={26} color="#FFFFFF" />
              <View style={styles.blueDot} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.headerCircle}>
              <Ionicons name="settings-outline" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dialBox}>
          <View style={styles.trackArc} />
          <View style={styles.activeArc} />
          <View style={styles.knob} />

          <MaterialCommunityIcons
            name="snowflake"
            size={46}
            color={accent}
            style={styles.snowflake}
          />

          <Text style={styles.modeLabel}>COOL MODE</Text>

          <Text style={styles.temp}>{temperature}°</Text>

          <Text style={styles.target}>Target Temperature</Text>

          <View style={styles.stepRow}>
            <TouchableOpacity
              style={styles.stepButton}
              onPress={() => setTemperature(Math.max(60, temperature - 1))}
            >
              <Text style={styles.stepText}>−</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.stepButton}
              onPress={() => setTemperature(Math.min(95, temperature + 1))}
            >
              <Text style={styles.stepText}>+</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={24} color="#A4A8B8" />
            <Text style={styles.timeBlue}>1h 42m</Text>
            <Text style={styles.timeLeft}> left</Text>
          </View>

          <Text style={styles.endsAt}>Ends at 4:35 AM</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Feather name="home" size={34} color="#A4A8B8" />
            <View>
              <Text style={styles.statLabel}>Room Temp</Text>
              <Text style={styles.statValue}>71°F</Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <MaterialCommunityIcons name="thermometer" size={34} color="#A4A8B8" />
            <View>
              <Text style={styles.statLabel}>BedJet Output</Text>
              <Text style={styles.statValue}>68°F</Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <MaterialCommunityIcons name="fan" size={34} color="#A4A8B8" />
            <View>
              <Text style={styles.statLabel}>Airflow</Text>
              <Text style={styles.statValue}>{fanSpeed}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.modeHeader}>
          <Text style={styles.sectionTitle}>BedJet Modes</Text>
          <Text style={styles.modeHint}>Tap a mode to activate</Text>
        </View>

        <View style={styles.modeRow}>
          {modes.map(([title, subtitle, icon, color]) => {
            const active = title === "COOL";

            return (
              <TouchableOpacity
                key={title}
                style={[styles.modeCard, active && styles.modeCardActive]}
              >
                <MaterialCommunityIcons
                  name={icon}
                  size={42}
                  color={color}
                />
                <Text style={[styles.modeCardTitle, !active && styles.inactiveText]}>
                  {title}
                </Text>
                <Text style={styles.modeCardSubtitle}>{subtitle}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.fanCard}>
          <View style={styles.fanLeft}>
            <View style={styles.fanIconCircle}>
              <MaterialCommunityIcons name="fan" size={34} color={accent} />
            </View>

            <View>
              <Text style={styles.fanTitle}>Fan Speed</Text>
              <Text style={styles.fanSubtitle}>
                Adjusts strength in all modes (except Off)
              </Text>
            </View>
          </View>

          <View style={styles.fanSliderWrap}>
            <Slider
              minimumValue={0}
              maximumValue={100}
              step={1}
              value={fanSpeed}
              onValueChange={setFanSpeed}
              minimumTrackTintColor={accent}
              maximumTrackTintColor="rgba(255,255,255,0.10)"
              thumbTintColor="#FFFFFF"
            />
          </View>

          <Text style={styles.fanPercent}>{fanSpeed}%</Text>
        </View>

        <View style={styles.scheduleCard}>
          <View style={styles.scheduleLeft}>
            <View style={styles.scheduleIcon}>
              <Ionicons name="calendar-outline" size={34} color="#7C4DFF" />
            </View>

            <View>
              <Text style={styles.scheduleLabel}>Next Scheduled Event</Text>
              <Text style={styles.scheduleTitle}>Warm Bed</Text>
              <Text style={styles.scheduleTime}>9:30 PM</Text>
            </View>
          </View>

          <View style={styles.scheduleDivider} />

          <View style={styles.scheduleRight}>
            <Text style={styles.startsLabel}>Starts in</Text>
            <Text style={styles.startsTime}>45m</Text>
          </View>

          <Ionicons name="chevron-forward" size={30} color="#9CA3AF" />
        </View>
      </ScrollView>
    </View>
  );
}

const dialSize = width * 0.72;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#020617",
  },

  content: {
    paddingTop: 66,
    paddingHorizontal: 16,
    paddingBottom: 130,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 28,
  },

  greeting: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "500",
  },

  connectedRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  greenDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: "#22E67D",
    marginRight: 10,
  },

  connected: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "400",
  },

  headerButtons: {
    flexDirection: "row",
    gap: 14,
  },

  headerCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(255,255,255,0.025)",
    justifyContent: "center",
    alignItems: "center",
  },

  blueDot: {
    position: "absolute",
    right: 8,
    top: 5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#1683FF",
  },

  dialBox: {
    height: 560,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  trackArc: {
    position: "absolute",
    top: 16,
    width: dialSize,
    height: dialSize,
    borderRadius: dialSize / 2,
    borderWidth: 5,
    borderColor: "rgba(255,255,255,0.13)",
    borderLeftColor: "transparent",
    borderBottomColor: "transparent",
    transform: [{ rotate: "40deg" }],
  },

  activeArc: {
    position: "absolute",
    top: 16,
    width: dialSize,
    height: dialSize,
    borderRadius: dialSize / 2,
    borderWidth: 5,
    borderColor: "#1683FF",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    transform: [{ rotate: "-26deg" }],
    shadowColor: "#1683FF",
    shadowOpacity: 0.65,
    shadowRadius: 12,
  },

  knob: {
    position: "absolute",
    top: 44,
    right: 116,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    shadowColor: "#FFFFFF",
    shadowOpacity: 0.75,
    shadowRadius: 8,
  },

  snowflake: {
    marginTop: 92,
    marginBottom: 10,
  },

  modeLabel: {
    color: "#1683FF",
    fontSize: 22,
    fontWeight: "500",
    marginBottom: 18,
  },

  temp: {
    color: "#FFFFFF",
    fontSize: 104,
    fontWeight: "500",
    lineHeight: 110,
  },

  target: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 17,
    marginTop: 4,
  },

  stepRow: {
    flexDirection: "row",
    gap: 48,
    marginTop: 24,
  },

  stepButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    backgroundColor: "rgba(255,255,255,0.025)",
    justifyContent: "center",
    alignItems: "center",
  },

  stepText: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "300",
  },

  divider: {
    width: 240,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
    marginTop: 28,
    marginBottom: 20,
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  timeBlue: {
    color: "#1683FF",
    fontSize: 24,
    marginLeft: 8,
  },

  timeLeft: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 24,
  },

  endsAt: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 16,
    marginTop: 8,
  },

  statsCard: {
    height: 92,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    backgroundColor: "rgba(8,16,29,0.56)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    marginBottom: 28,
  },

  statItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  statDivider: {
    width: 1,
    height: 48,
    backgroundColor: "rgba(255,255,255,0.07)",
    marginHorizontal: 10,
  },

  statLabel: {
    color: "rgba(255,255,255,0.62)",
    fontSize: 14,
  },

  statValue: {
    color: "#FFFFFF",
    fontSize: 22,
    marginTop: 3,
  },

  modeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 21,
  },

  modeHint: {
    color: "rgba(255,255,255,0.58)",
    fontSize: 16,
  },

  modeRow: {
    flexDirection: "row",
    gap: 7,
    marginBottom: 24,
  },

  modeCard: {
    flex: 1,
    height: 146,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    backgroundColor: "rgba(8,15,28,0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },

  modeCardActive: {
    borderColor: "#1683FF",
    backgroundColor: "rgba(22,131,255,0.08)",
  },

  modeCardTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    marginTop: 12,
  },

  inactiveText: {
    color: "rgba(255,255,255,0.42)",
  },

  modeCardSubtitle: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 11,
    textAlign: "center",
    marginTop: 5,
  },

  fanCard: {
    height: 112,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    backgroundColor: "rgba(8,16,29,0.58)",
    marginBottom: 22,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  fanLeft: {
    flexDirection: "row",
    alignItems: "center",
    width: 230,
  },

  fanIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(22,131,255,0.10)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  fanTitle: {
    color: "#FFFFFF",
    fontSize: 18,
  },

  fanSubtitle: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
    marginTop: 6,
  },

  fanSliderWrap: {
    flex: 1,
    marginRight: 16,
  },

  fanPercent: {
    color: "#1683FF",
    fontSize: 27,
    width: 64,
    textAlign: "right",
  },

  scheduleCard: {
    height: 124,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    backgroundColor: "rgba(8,16,29,0.58)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  scheduleLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1.4,
  },

  scheduleIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "rgba(124,77,255,0.14)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  scheduleLabel: {
    color: "#9B6DFF",
    fontSize: 15,
  },

  scheduleTitle: {
    color: "#FFFFFF",
    fontSize: 19,
    marginTop: 5,
  },

  scheduleTime: {
    color: "#FFFFFF",
    fontSize: 27,
    marginTop: 2,
  },

  scheduleDivider: {
    width: 1,
    height: 62,
    backgroundColor: "rgba(255,255,255,0.07)",
    marginHorizontal: 16,
  },

  scheduleRight: {
    flex: 0.55,
  },

  startsLabel: {
    color: "rgba(255,255,255,0.58)",
    fontSize: 15,
  },

  startsTime: {
    color: "#FFFFFF",
    fontSize: 28,
    marginTop: 8,
  },
});