/**
 * The code is a React component that allows users to reset their password by sending a password
 * reset email.
 * @returns The `ForgotPassword` component is being returned.
 */
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { FIREBASE_AUTH as auth } from "../../firebaseConfig";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleResetPassword = () => {
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
  };

  return (
    <View>
      <Text>Enter your email address:</Text>
      <TextInput
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder="Email"
      />
      <Button title="Reset Password" onPress={handleResetPassword} />
    </View>
  );
};

export default ForgotPassword;
