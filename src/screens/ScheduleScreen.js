import { View, Text } from "react-native";

export default function ScheduleScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#050816",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 28,
        }}
      >
        Schedule
      </Text>
    </View>
  );
}