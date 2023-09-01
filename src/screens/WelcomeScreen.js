/**
 * The WelcomeScreen component is a React Native screen that displays a background image, a logo, a
 * slogan, and buttons for signing up and logging in.
 * @returns The WelcomeScreen component is returning a JSX element.
 */
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Image,
  ActivityIndicator,
  StatusBar,
  Platform,
} from "react-native";
import styles from "../assets/WelcomeScreen.styles.js";
import { Asset } from "expo-asset";

const WelcomeScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const preloadImages = async () => {
      // Preload the background image
      await Asset.loadAsync(require("../../src/assets/space.png"));
      // Set isLoading to false after the image is pre-loaded
      setIsLoading(false);
    };

    preloadImages();
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
      source={require("../../src/assets/space.png")}
      style={styles.container}
    >
      {Platform.OS === "ios" && <StatusBar barStyle="dark-content" />}
      {Platform.OS === "android" && (
        <StatusBar
          translucent={true}
          backgroundColor="transparent"
          barStyle="dark-content"
        />
      )}

      <View style={styles.logoContainer}>
        <Image
          source={require("../../src/assets/icon.png")}
          style={styles.logo}
        />
        <Text style={styles.slogan}>
          Otterly Unforgettable Experiences Await!
        </Text>
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
