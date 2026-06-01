import {
  useEffect,
  useState,
} from "react";

import {
  View,
} from "react-native";

import {
  NavigationContainer,
} from "@react-navigation/native";

import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import {
  Ionicons,
} from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import ScheduleScreen from "../screens/ScheduleScreen";
import SleepScreen from "../screens/SleepScreen";
import SettingsScreen from "../screens/SettingsScreen";

import PairingScreen from "../screens/pairing/PairingScreen";

import { storageService } from "../services/storage/storageService";

const Tab =
  createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarShowLabel: true,

  tabBarStyle: {
  position: "absolute",

  left: 32,
  right: 32,

  bottom: 10,

  height: 74,

  borderTopWidth: 0,

  borderRadius: 32,

  backgroundColor:
    "rgba(12,18,32,0.58)",

  borderWidth: 1,

  borderColor:
    "rgba(255,255,255,0.05)",

  overflow: "hidden",

  paddingTop: 8,
  paddingBottom: 2,

  elevation: 0,

  shadowColor: "#000",
  shadowOpacity: 0.18,
  shadowRadius: 20,

  shadowOffset: {
    width: 0,
    height: 8,
  },
},

        tabBarActiveTintColor:
          "#1683FF",

        tabBarInactiveTintColor:
          "rgba(255,255,255,0.42)",

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "500",
          marginTop: 2,
        },

        tabBarItemStyle: {
          justifyContent:
            "center",
          alignItems:
            "center",
        },

        tabBarIcon: ({
          focused,
          color,
        }) => {
          let icon;

          switch (
            route.name
          ) {
            case "Home":
              icon = "home";
              break;

            case "Schedule":
              icon =
                "calendar-outline";
              break;

            case "Sleep":
              icon =
                "moon-outline";
              break;

            case "Settings":
              icon =
                "ellipsis-horizontal";
              break;

            default:
              icon =
                "ellipse";
          }

          // Render-style active pill
          if (
            focused &&
            route.name ===
              "Home"
          ) {
            return (
              <View
                style={{
                  width: 58,
                  height: 32,
                  borderRadius: 16,

                  backgroundColor:
                    "rgba(8,12,22,0.78)",

                  borderWidth: 0.7,

                  borderColor:
                    "rgba(22,131,255,0.22)",

                  justifyContent:
                    "center",

                  alignItems:
                    "center",

                  shadowColor:
                    "#1683FF",

                  shadowOpacity: 0.03,
                  shadowRadius: 3,

                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                }}
              >
                <Ionicons
                  name="home"
                  size={19}
                  color="#1683FF"
                />
              </View>
            );
          }

          return (
            <Ionicons
              name={icon}
              size={25}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={
          HomeScreen
        }
      />

      <Tab.Screen
        name="Schedule"
        component={
          ScheduleScreen
        }
      />

      <Tab.Screen
        name="Sleep"
        component={
          SleepScreen
        }
      />

      <Tab.Screen
        name="Settings"
        component={
          SettingsScreen
        }
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [paired, setPaired] =
    useState(null);

  useEffect(() => {
    checkPairing();
  }, []);

  const checkPairing =
    async () => {
      const isPaired =
        await storageService.isPaired();

      setPaired(isPaired);
    };

  const completePairing =
    async () => {
      await storageService.setPaired(
        true
      );

      setPaired(true);
    };

  if (paired === null)
    return null;

  return (
    <NavigationContainer>
      {paired ? (
        <MainTabs />
      ) : (
        <PairingScreen
          onPairSuccess={
            completePairing
          }
        />
      )}
    </NavigationContainer>
  );
}