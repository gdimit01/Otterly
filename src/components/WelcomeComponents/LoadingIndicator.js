import React from "react";
import { View, ActivityIndicator } from "react-native";
import styles from "../assets/WelcomeScreen.styles.js";

const LoadingIndicator = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default LoadingIndicator;
