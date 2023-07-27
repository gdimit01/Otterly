import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";

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
      <View style={styles.logoContainer}>
        <Image source={require("../assets/icon.png")} style={styles.logo} />
        <Text style={styles.slogan}>What do you love?</Text>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.text}>
          Already a member?{" "}
          <Text style={styles.link} onPress={handleLogIn}>
            Log in
          </Text>
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  logo: {
    width: 200,
    height: 100,
    resizeMode: "contain",
  },
  slogan: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
  },
  bottomContainer: {
    width: "80%",
    alignItems: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#f64060",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    width: "130%",
    height: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    color: "#fff",
    marginTop: 20,
  },
  link: {
    color: "#f64060",
    textDecorationLine: "underline",
  },
});

export default WelcomeScreen;
