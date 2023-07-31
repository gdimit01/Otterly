import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "../../screens/WelcomeScreen";
import LoginScreen from "../../screens/LoginScreen";
import SignupScreen from "../../screens/SignupScreen";
import { HomeNavigator } from "./home.navigator";
import EventScreen from "../../screens/EventScreen";
import StudyGroupsScreen from "../../screens/StudyGroupsScreen";
import SocialGroupsScreen from "../../screens/SocialGroupsScreen";
import SettingsScreen from "../../screens/SettingsScreen";

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeStack"
          component={HomeNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EventScreen"
          component={EventScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StudyGroups"
          component={StudyGroupsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SocialGroups"
          component={SocialGroupsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
