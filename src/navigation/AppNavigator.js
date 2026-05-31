import {
  useEffect,
  useState,
} from "react";

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
      screenOptions={({
        route,
      }) => ({
        headerShown: false,

        tabBarStyle: {
          backgroundColor:
            "#09090B",
          borderTopColor:
            "rgba(255,255,255,0.08)",
        },

        tabBarActiveTintColor:
          "#7C4DFF",

        tabBarInactiveTintColor:
          "#71717A",

        tabBarIcon: ({
          color,
          size,
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
                "calendar";
              break;

            case "Sleep":
              icon = "moon";
              break;

            case "Settings":
              icon =
                "settings";
              break;
          }

          return (
            <Ionicons
              name={icon}
              size={size}
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