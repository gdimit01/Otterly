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
  Platform,
  Alert,
} from "react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  reload,
} from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import Icon from "react-native-vector-icons/FontAwesome";

const SignupScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      // Validate form data
      if (email !== confirmEmail) {
        alert("Email does not match.");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        alert("Password does not match.");
        setLoading(false);
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

        // Create a document for the new user
        const db = getFirestore();
        await setDoc(doc(db, "users", response.user.uid), {
          firstName: firstName,
          surname: surname,
          email: response.user.email,
        });

        // Send email verification
        try {
          await sendEmailVerification(response.user);
          console.log("Verification Email Sent");

          // Alert to verify email
          const verifyAlert = () =>
            Alert.alert(
              "Email Sent",
              "Verification Email Sent! Please check your inbox and verify your email.",
              [
                {
                  text: "I've Verified",
                  onPress: async () => {
                    // Wait for the user to press "I've Verified"
                    // then reload the user's information from Firebase
                    await reload(response.user);

                    if (response.user.emailVerified) {
                      // If the email is verified, navigate to the home screen
                      navigation.navigate("HomeStack");
                    } else {
                      // If the email isn't verified, show the alert again
                      verifyAlert();
                    }
                  },
                },
              ],
              { cancelable: false }
            );

          verifyAlert();
        } catch (error) {
          console.error("Failed to Send Verification Email: ", error);
          alert("Failed to Send Verification Email: " + error.message);
        }
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
