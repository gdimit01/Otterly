import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FIREBASE_AUTH } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, doc, setDoc } from "@firebase/firestore";
import { createUserWithEmailAndPassword } from "@firebase/auth";
import { useNavigation } from "@react-navigation/native";
import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import Icon from "react-native-vector-icons/FontAwesome";

const SignupScreen = (props) => {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };
  //new additions
  const handleSignUp = async () => {
    setLoading(true);
    try {
      // Validate form data
      if (email !== confirmEmail) {
        alert("Email does not match.");
        return;
      }

      if (password !== confirmPassword) {
        alert("Password does not match.");
        return;
      }

      // Create user with email and password
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Check if user creation was successful
      if (response && response.user) {
        // User created successfully
        console.log("User created successfully:", response.user);
        console.log("User ID:", response.user.uid); // This is the user's ID

        // Store user ID in AsyncStorage
        await AsyncStorage.setItem("userID", response.user.uid);

        // Get Firestore instance
        const db = getFirestore();

        // Add user details to Firestore
        await setDoc(doc(db, "users", response.user.uid), {
          firstName: firstName,
          surname: surname,
          email: email,
        });

        alert("User created successfully!");
        navigation.navigate("HomeStack"); // navigate to HomeScreen after successful signup
      } else {
        // User creation failed
        alert("User creation failed.");
      }
    } catch (error) {
      console.log(error);
      alert("Sign up failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            {/* <Image source={require("../../assets/back_arrow.png")} /> */}
          </TouchableOpacity>
          <Icon name="user-plus" size={30} color="#000" style={styles.icon} />
          <Text style={styles.title}>Sign Up</Text>
          <FormInput
            value={firstName}
            placeholder="First Name"
            onChangeText={setFirstName}
          />
          <FormInput
            value={surname}
            placeholder="Surname"
            onChangeText={setSurname}
          />
          <FormInput
            value={email}
            placeholder="Email"
            onChangeText={setEmail}
          />
          <FormInput
            value={confirmEmail}
            placeholder="Confirm Email"
            onChangeText={setConfirmEmail}
          />
          <FormInput
            value={password}
            placeholder="Password"
            secure={true}
            onChangeText={setPassword}
          />
          <FormInput
            value={confirmPassword}
            placeholder="Confirm Password"
            secure={true}
            onChangeText={setConfirmPassword}
          />

          {loading ? (
            <ActivityIndicator size="large" color="#f64060" />
          ) : (
            <FormButton title="Create Account" onPress={handleSignUp} />
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  icon: {
    marginBottom: 10,
    alignSelf: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default SignupScreen;
