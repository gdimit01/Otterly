/**
 * The code is a JavaScript function that represents a login screen in a React Native
 * application.
 * @returns The LoginScreen component is being returned.
 */
import { useNavigation } from "@react-navigation/core";
import Dialog from "react-native-dialog";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  StatusBar,
  Platform,
} from "react-native";
import { FIREBASE_AUTH as auth } from "../../firebaseConfig";
import FormButton from "../../components/FormButton";
import FormInput from "../../components/FormInput";
import Icon from "react-native-vector-icons/FontAwesome";

// Firebase
import {
  getFirestore,
  setDoc,
  doc,
  serverTimestamp,
} from "@firebase/firestore";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "@firebase/auth";

const LoginScreen = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const firestore = getFirestore();

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("HomeStack");
      } else {
        console.log("User is currently not logged in.");
      }
    });

    return unsubscribe;
  }, []);

  //new additions
  const handleLogin = () => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with:", user.email);
        console.log("User ID:", user.uid); // This is the user's ID

        // Store user ID in AsyncStorage
        await AsyncStorage.setItem("userID", user.uid);

        // Update lastAuth field in Firestore
        await setDoc(
          doc(firestore, "users", user.uid),
          {
            lastAuth: serverTimestamp(),
          },
          { merge: true }
        );

        setLoading(false);
      })
      .catch((error) => {
        alert(error.message);
        setLoading(false);
      });
  };

  const showDialog = () => {
    setDialogVisible(true);
  };

  const handleCancel = () => {
    setDialogVisible(false);
  };

  const handleOk = () => {
    if (resetEmail) {
      sendPasswordResetEmail(auth, resetEmail)
        .then(() => {
          Alert.alert("Password reset email sent!");
        })
        .catch((error) => {
          Alert.alert(
            "Error occurred while sending password reset email: ",
            error.message
          );
        });
    } else {
      Alert.alert("Please enter your email.");
    }
    setDialogVisible(false);
  };

  /**
   * The function `handleForgotPassword` handles the logic for resetting a user's password, including
   * displaying a dialog or an alert depending on the platform.
   */
  const handleForgotPassword = () => {
    if (Platform.OS === "android") {
      setResetEmail("");
      showDialog();
    } else {
      Alert.prompt(
        "Forgot Password",
        "Please enter your email:",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: (email) => {
              if (email) {
                sendPasswordResetEmail(auth, email)
                  .then(() => {
                    Alert.alert("Password reset email sent!");
                  })
                  .catch((error) => {
                    Alert.alert(
                      "Error occurred while sending password reset email: ",
                      error.message
                    );
                  });
              } else {
                Alert.alert("Please enter your email.");
              }
            },
          },
        ],
        "plain-text"
      );
    }
  };

  return (
    <>
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Forgot Password</Dialog.Title>
        <Dialog.Description>Please enter your email:</Dialog.Description>
        <Dialog.Input onChangeText={(text) => setResetEmail(text)} />
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="OK" onPress={handleOk} />
      </Dialog.Container>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : null}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <StatusBar barStyle="dark-content" />
          <View style={styles.contentContainer}>
            <Icon name="user" size={30} color="#000" style={styles.icon} />
            <Text style={styles.title}>Otterly App</Text>
            <FormInput
              value={email}
              placeholder="Email"
              onChangeText={(text) => setEmail(text)}
            />
            <FormInput
              value={password}
              placeholder="Password"
              secure={true}
              onChangeText={(text) => setPassword(text)}
            />
            {loading ? (
              <ActivityIndicator size="large" color="#f64060" />
            ) : (
              <FormButton title="Log In" onPress={handleLogin} />
            )}
            <Text style={styles.forgotPassword} onPress={handleForgotPassword}>
              Forgot Password?
            </Text>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
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
  forgotPassword: {
    color: "#f64060",
    textDecorationLine: "underline",
    textAlign: "center",
    marginTop: 15,
  },
});
