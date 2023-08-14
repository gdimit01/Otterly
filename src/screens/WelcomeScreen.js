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

const WelcomeScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  const background = require("../../src/assets/space.png");
  const logo = require("../../src/assets/icon.png");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Change this value to adjust the duration of the loading screen

    return () => clearTimeout(timer);
  }, []);

  const handleImageLoad = () => {
    setImagesLoaded(imagesLoaded + 1);
  };

  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };

  const handleLogIn = () => {
    navigation.navigate("Login");
  };

  if (isLoading || imagesLoaded < 2) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        {/* Preload images by rendering them off-screen */}
        <Image
          source={background}
          onLoad={handleImageLoad}
          style={{ width: 0, height: 0 }}
        />
        <Image
          source={logo}
          onLoad={handleImageLoad}
          style={{ width: 0, height: 0 }}
        />
      </View>
    );
  }

  return (
    <ImageBackground source={background} style={styles.container}>
      {Platform.OS === "android" && (
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
      )}
      {/* Add StatusBar for Android */}
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
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
