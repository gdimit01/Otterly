import React, { memo, useMemo } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "../../src/screens/WelcomeScreen";
import LoginScreen from "../../src/screens/LoginScreen";
import SignupScreen from "../../src/screens/SignupScreen";
import { HomeNavigator } from "./home.navigator";
import EventScreen from "../../src/screens/EventScreen";
import StudyGroupsScreen from "../../src/screens/StudyGroupsScreen";
import SocialGroupsScreen from "../../src/screens/SocialGroupsScreen";
import SettingsScreen from "../../src/screens/SettingsScreen";

const Stack = createNativeStackNavigator();

const WelcomeScreenMemo = memo(WelcomeScreen);
const LoginScreenMemo = memo(LoginScreen);
const SignupScreenMemo = memo(SignupScreen);
const HomeNavigatorMemo = memo(HomeNavigator);
const EventScreenMemo = memo(EventScreen);
const StudyGroupsScreenMemo = memo(StudyGroupsScreen);
const SocialGroupsScreenMemo = memo(SocialGroupsScreen);
const SettingsScreenMemo = memo(SettingsScreen);

export function AppNavigator() {
  const screenOptions = useMemo(() => ({ headerShown: false }), []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={screenOptions}>
        <Stack.Screen name="Welcome" component={WelcomeScreenMemo} />
        <Stack.Screen name="Login" component={LoginScreenMemo} />
        <Stack.Screen name="SignUp" component={SignupScreenMemo} />
        <Stack.Screen name="HomeStack" component={HomeNavigatorMemo} />
        <Stack.Screen name="EventScreen" component={EventScreenMemo} />
        <Stack.Screen name="StudyGroups" component={StudyGroupsScreenMemo} />
        <Stack.Screen name="SocialGroups" component={SocialGroupsScreenMemo} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreenMemo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
