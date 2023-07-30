import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Image,
  ActivityIndicator,
  StatusBar, // Import StatusBar
  Platform, // Import Platform to identify if the device is Android
} from "react-native";
import styles from "./WelcomeScreen.styles.js";

const WelcomeScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Change this value to adjust the duration of the loading screen

    return () => clearTimeout(timer);
  }, []);

  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };

  const handleLogIn = () => {
    navigation.navigate("Login");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../assets/space.png")}
      style={styles.container}
    >
      {Platform.OS === "android" && (
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
      )}
      {/* Add StatusBar for Android */}
      <View style={styles.logoContainer}>
        <Image source={require("../assets/icon.png")} style={styles.logo} />
        <Text style={styles.slogan}>What do you love?</Text>
      </View>
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
    </ImageBackground>
  );
};

export default WelcomeScreen;
