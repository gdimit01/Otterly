import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import WelcomeScreen from "../../features/auth/screens/WelcomeScreen";
import LoginScreen from "../../features/auth/screens/LoginScreen";
import SignUpScreen from "../../features/auth/screens/SignUpScreen";

const Stack = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      {/* Add more screens as needed */}
    </Stack.Navigator>
  );
};
