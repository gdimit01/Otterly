import React from "react";
import { View, Image, Text } from "react-native";
import styles from "../assets/WelcomeScreen.styles.js";

const LogoContainer = () => {
  return (
    <View style={styles.logoContainer}>
      <Image
        source={require("../../src/assets/icon.png")}
        style={styles.logo}
      />
      <Text style={styles.slogan}>What do you love?</Text>
    </View>
  );
};

export default LogoContainer;
