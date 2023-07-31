import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Linking, // Import Linking from react-native
} from "react-native";
import { FIREBASE_AUTH as auth } from "../firebaseConfig";
import { sendSignInLinkToEmail } from "@firebase/auth"; // Update the import statement

const ReauthenticateScreen = ({ route, navigation }) => {
  const [isSendingEmail, setSendingEmail] = useState(false);
  const [hasSentEmail, setSentEmail] = useState(false);

  const sendEmail = async () => {
    setSendingEmail(true);
    const actionCodeSettings = {
      url: "https://www.example.com/finishSignUp?cartId=1234",
      handleCodeInApp: true,
      iOS: {
        bundleId: "com.example.ios",
      },
      android: {
        packageName: "com.example.android",
        installApp: true,
        minimumVersion: "12",
      },
      dynamicLinkDomain: "example.page.link",
    };

    try {
      // You need to pass the auth instance to the sendSignInLinkToEmail function
      await sendSignInLinkToEmail(
        auth,
        auth.currentUser.email,
        actionCodeSettings
      );
      setSendingEmail(false);
      setSentEmail(true);
    } catch (error) {
      console.error("Error sending reauthentication email:", error);
      setSendingEmail(false);
    }
  };

  useEffect(() => {
    // Listen for the focus event, which is fired when the user navigates to this screen
    const unsubscribe = navigation.addListener("focus", async () => {
      // This function is called whenever the screen comes into focus
      // We'll try to apply the action code here
      const url = await Linking.getInitialURL(); // Get the initial URL

      if (auth.isSignInWithEmailLink(url)) {
        try {
          await auth.applyActionCode(auth.currentUser, url); // Apply the action code
          route.params.onSuccess(); // Notify the previous screen that the operation was successful
          navigation.goBack(); // Navigate back
        } catch (error) {
          console.error("Error applying action code:", error);
        }
      }
    });

    // Cleanup function
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        For security reasons, we need to reauthenticate your account.
      </Text>
      {!hasSentEmail ? (
        <Button
          title="Send Verification Email"
          onPress={sendEmail}
          disabled={isSendingEmail}
        />
      ) : (
        <ActivityIndicator />
      )}
      {isSendingEmail && <Text>Sending verification email...</Text>}
      {hasSentEmail && (
        <Text>
          Verification email sent. Check your inbox and click the link.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default ReauthenticateScreen;
