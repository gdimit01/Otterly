import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  Button,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { FIREBASE_AUTH as auth } from "../firebaseConfig";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from "@firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import FormButton from "../components/FormButton"; // import the FormButton component

import LabelInput from "../components/LabelInput";

const SettingsScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState("");

  const loadName = async () => {
    const storedName = await AsyncStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log("Auth state changed:", user);
      if (user) {
        const db = getFirestore();
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setName(docSnap.data().firstName);
          setEmail(user.email);
          // Rest of your Firestore queries and onSnapshot functions...
        } else {
          console.log("No such document!");
        }
      }
    });

    loadName();

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const handleSave = async () => {
    try {
      // Save the changes here, e.g., update the user profile in your database
      const user = auth.currentUser;
      if (user) {
        const db = getFirestore();
        const docRef = doc(db, "users", user.uid);

        // Set the "firstName" field of the user's document
        await setDoc(docRef, { firstName: name }, { merge: true });

        // Store the user's name in AsyncStorage
        await AsyncStorage.setItem("name", name);

        // Load the updated name
        loadName();
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (user) {
      const db = getFirestore();
      const docRef = doc(db, "users", user.uid);

      // Delete the user's document from Firestore
      await deleteDoc(docRef);

      // Delete the user's info from AsyncStorage
      await AsyncStorage.removeItem("name");

      // Delete the user's account from Firebase Auth
      user
        .delete()
        .then(() => {
          Alert.alert(
            "Account Deleted",
            "Your account has been deleted. Press OK to return to the Welcome screen.",
            [
              {
                text: "OK",
                onPress: () => {
                  navigation.popToTop(); // clear the navigation stack
                  navigation.navigate("Welcome"); // navigate to "Main"
                },
              },
            ],
            { cancelable: false }
          );
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
        <View style={styles.content}>
          <Image
            style={styles.profileImage}
            source={{ uri: "https://via.placeholder.com/150" }}
          />
          <Text style={styles.title}>Edit Profile</Text>

          {/* Name Input */}
          <LabelInput label="Name" value={name} onChangeText={setName} />

          {/* Email Display */}
          <Text style={styles.label}>Email</Text>
          <Text style={styles.input}>{email}</Text>

          {/* Interests Input */}
          <LabelInput
            label="Interests"
            value={interests}
            onChangeText={setInterests}
          />

          <FormButton title="Save Changes" onPress={handleSave} />
          <FormButton title="Delete Account" onPress={handleDeleteAccount} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    alignSelf: "flex-start",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 20,
    paddingLeft: 10,
  },
});

export default SettingsScreen;
