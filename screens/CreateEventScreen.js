import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormButton from "../components/FormButton"; // import the FormButton component
import FormInput from "../components/FormInput";

import { getFirestore, collection, addDoc } from "@firebase/firestore";
import { FIREBASE_AUTH as auth } from "../firebaseConfig";
import { doc, getDoc } from "@firebase/firestore";

const CreateEventScreen = () => {
  const [creator, setCreator] = useState("");
  const [invites, setInvites] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log("Auth state changed:", user);

      if (user) {
        const db = getFirestore();
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCreator({
            email: docSnap.data().email,
            firstName: docSnap.data().firstName,
            surname: docSnap.data().surname,
          });
        } else {
          console.log("No such document!");
        }
      }
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const createEvent = async () => {
    try {
      const user = auth.currentUser; // Get the currently logged-in user
      if (user) {
        const db = getFirestore();
        const eventRef = await addDoc(collection(db, "events"), {
          name: eventName,
          location: eventLocation,
          description: eventDescription,
          creator: creator,
          invites: invites.split(",").map((email) => email.trim()),
          userId: user.uid, // Add the user's ID to the event document
        });
        console.log("Event document written with ID: ", eventRef.id);

        // Create a notification for the new event
        const notificationRef = await addDoc(collection(db, "notifications"), {
          title: `New Event Created: ${eventName}`,
          description: `Created by ${creator.firstName} ${creator.surname} (${creator.email})`,
          image: "https://via.placeholder.com/150", // Replace with the actual image URL
          time: new Date().toLocaleString([], { timeZoneName: "short" }), // Current time with timezone abbreviation
          userId: user.uid, // Add the user's ID to the notification document
          eventId: eventRef.id, // Add the event's ID to the notification document
        });

        console.log(
          "Notification document written with ID: ",
          notificationRef.id
        );

        // Save the event ID to AsyncStorage
        await AsyncStorage.setItem("lastCreatedEventId", eventRef.id);

        Alert.alert("Success", "Event successfully created"); // Show success message
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <>
            <Text style={styles.title}>Create Event</Text>
            <FormInput
              style={styles.input}
              placeholder="Event Name"
              value={eventName}
              onChangeText={setEventName}
            />
            <FormInput
              style={styles.input}
              placeholder="Event Location"
              value={eventLocation}
              onChangeText={setEventLocation}
            />
            <FormInput
              style={styles.input}
              placeholder="Event Description"
              value={eventDescription}
              onChangeText={setEventDescription}
            />
            <FormInput
              style={styles.input}
              placeholder="Invites (comma separated emails)"
              value={invites}
              onChangeText={setInvites}
            />
            <FormButton title="Create Event" onPress={createEvent} />
            {/* Use FormButton here */}
          </>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center", // Center the content horizontally
    justifyContent: "center", // Center the content vertically
  },
  content: {
    width: "80%", // Set the width to 80% of the parent container
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center", // Center the text within the container
  },
});

export default CreateEventScreen;
