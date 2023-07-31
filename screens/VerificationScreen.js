import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { FIREBASE_AUTH } from "../firebaseConfig";
import { useNavigation } from "@react-navigation/native";

const VerificationScreen = () => {
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();

  const handleCheckVerification = async () => {
    const user = auth.currentUser;

    // Reload to get the latest user data
    await user.reload();

    // Check if email is verified
    if (user.emailVerified) {
      navigation.navigate("HomeScreen");
    } else {
      alert("Please verify your email to proceed.");
    }
  };

  return (
    <View style={styles.container}>
      <Text>
        Please verify your email. Once verified, press the button below.
      </Text>
      <Button
        title="I have verified my email"
        onPress={handleCheckVerification}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
});

export default VerificationScreen;
