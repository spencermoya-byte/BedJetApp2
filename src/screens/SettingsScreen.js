import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import {
  useTheme,
} from "../hooks/ThemeContext";

export default function SettingsScreen() {
  const {
    theme,
    updateTheme,
    colors,
  } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}
    >
      <Text
        style={[
          styles.title,
          {
            color:
              colors.text,
          },
        ]}
      >
        Appearance
      </Text>

      {[
        "light",
        "dark",
        "system",
      ].map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.option,
            {
              backgroundColor:
                theme ===
                item
                  ? colors.primary
                  : colors.cardSolid,
            },
          ]}
          onPress={() =>
            updateTheme(
              item
            )
          }
        >
          <Text
            style={[
              styles.optionText,
              {
                color:
                  theme ===
                  item
                    ? "#FFF"
                    : colors.text,
              },
            ]}
          >
            {item
              .charAt(0)
              .toUpperCase() +
              item.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      paddingTop: 80,
    },

    title: {
      fontSize: 32,
      fontWeight: "700",
      marginBottom: 24,
    },

    option: {
      borderRadius: 24,
      padding: 22,
      marginBottom: 12,
    },

    optionText: {
      fontSize: 18,
      fontWeight: "600",
    },
  });