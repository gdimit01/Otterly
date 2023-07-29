import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../../screens/HomeScreen";
import ExploreScreen from "../../screens/ExploreScreen";
import CreateEventScreen from "../../screens/CreateEventScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import NotificationsScreen from "../../screens/NotificationsScreen";
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
      })}
      tabBarOptions={{
        activeTintColor: "tomato",
        inactiveTintColor: "gray",
      }}
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
