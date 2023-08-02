import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import styles from "../../src/assets/WelcomeScreen.styles.js";

const BottomContainer = ({ navigation }) => {
  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };

  const handleLogIn = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.bottomContainer}>
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={styles.text}>
        Already a member?
        <Text style={styles.link} onPress={handleLogIn}>
          Log in
        </Text>
      </Text>
    </View>
  );
};

export default BottomContainer;
