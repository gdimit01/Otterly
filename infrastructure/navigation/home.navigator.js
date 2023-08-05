import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../../src/screens/HomeScreen";
import ExploreScreen from "../../src/screens/ExploreScreen";
import CreateEventScreen from "../../src/screens/CreateEventScreen";
import ProfileScreen from "../../src/screens/ProfileScreen";
import NotificationsScreen from "../../src/screens/NotificationsScreenOLD";
import { Ionicons } from "@expo/vector-icons"; // make sure to install this package

const Tab = createBottomTabNavigator();

export const HomeNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? "home" : "home-outline",
            Explore: focused ? "compass" : "compass-outline",
            Create: focused ? "add" : "add-outline",
            Notifications: focused ? "alarm" : "alarm-outline",
            Profile: focused ? "person" : "person-outline",
          };

          // You can return any component that you like here!
          return (
            <Ionicons name={icons[route.name]} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: [
          {
            display: "flex",
          },
          null,
        ],
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Create"
        component={CreateEventScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};
