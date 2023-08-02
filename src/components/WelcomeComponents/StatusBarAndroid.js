import React from "react";
import { StatusBar } from "react-native";
import styles from "../assets/WelcomeScreen.styles.js";

const StatusBarAndroid = () => {
  return (
    <StatusBar
      translucent
      backgroundColor="transparent"
      barStyle="light-content"
    />
  );
};

export default StatusBarAndroid;
