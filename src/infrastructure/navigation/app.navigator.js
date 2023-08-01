import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeNavigator from "./HomeNavigator";
import MeetUpsNavigator from "./MeetUpsNavigator";
import ProfileNavigator from "./ProfileNavigator";

const Tab = createBottomTabNavigator();

const TAB_ICON = {
  Home: "md-home",
  MeetUps: "md-calendar",
  Profile: "md-person",
};

const createScreenOptions = ({ route }) => {
  const iconName = TAB_ICON[route.name];
  return {
    tabBarIcon: ({ size, color }) => (
      <Icon name={iconName} size={size} color={color} />
    ),
  };
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={createScreenOptions}
        tabBarOptions={{
          activeTintColor: "tomato",
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeNavigator}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="MeetUps"
          component={MeetUpsNavigator}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileNavigator}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
