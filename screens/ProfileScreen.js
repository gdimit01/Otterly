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

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState("");
  const [refresh, setRefresh] = useState(false); // Add this line

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
        } else {
          console.log("No such document!");
        }
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [refresh]); // Add refresh here

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

        // Trigger a refresh of the user data
        setRefresh(!refresh);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  // Load the user's name from AsyncStorage when the component mounts
  useEffect(() => {
    const loadName = async () => {
      const storedName = await AsyncStorage.getItem("name");
      if (storedName) {
        setName(storedName);
      }
    };

    loadName();
  }, []);

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete account?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (user) {
                const db = getFirestore();
                await deleteDoc(doc(db, "users", user.uid));
                await user.delete();
                navigation.navigate("WelcomeScreen"); // Navigate to WelcomeScreen
              }
            } catch (error) {
              console.error("Error deleting account:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
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

          {/* Email Input */}
          <LabelInput label="Email" value={email} onChangeText={setEmail} />

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

export default ProfileScreen;
