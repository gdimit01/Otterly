import React, { useState, useEffect, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Alert,
  visibility,
} from "react-native";
import { EventContext } from "../screens/EventContext"; // Import EventContext

import AsyncStorage from "@react-native-async-storage/async-storage";
import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import FormPicker from "../components/FormPicker";
import RNPickerSelect from "react-native-picker-select";

import { getFirestore, collection, addDoc } from "@firebase/firestore";
import { FIREBASE_AUTH as auth } from "../firebaseConfig";
import { doc, getDoc } from "@firebase/firestore";

const CreateEventScreen = () => {
  const [creator, setCreator] = useState("");
  const [invites, setInvites] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [tag, setTag] = useState(null); // Initialize as null
  const [group, setGroup] = useState(null); // Initialize as null
  const [events, setEvents] = useContext(EventContext);
  const [visibility, setVisibility] = useState(true); // Set the initial value to true

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

  useEffect(() => {
    console.log("Events updated:", events);
  }, [events]);

  //TO DO: recheck this as the creator field comes up empty
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
          tag: tag, // Set as string
          group: group, // Set as string
          visibility: visibility, // Set the visibility field in the document

          invites: invites
            .split(",")
            .map((email) => ({ email: email.trim(), status: "pending" })), // Add inviteStatus field
        });
        // Create an invites collection in each event document
        invites.split(",").map(async (email) => {
          const inviteRef = await addDoc(
            collection(db, `events/${eventRef.id}/invites`),
            {
              email: email.trim(),
              status: "pending",
            }
          );
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
          tag: tag, // Set as string
          group: group, // Set as string
        });

        console.log(
          "Notification document written with ID: ",
          notificationRef.id
        );

        // Create a studygroups for the new event
        const studygroupsRef = await addDoc(collection(db, "studygroups"), {
          title: `New Event Created: ${eventName}`,
          description: `Created by ${creator.firstName} ${creator.surname} (${creator.email})`,
          image: "https://via.placeholder.com/150", // Replace with the actual image URL
          time: new Date().toLocaleString([], { timeZoneName: "short" }), // Current time with timezone abbreviation
          userId: user.uid, // Add the user's ID to the notification document
          eventId: eventRef.id, // Add the event's ID to the notification document
          tag: tag, // Set as string
          group: group, // Set as string
          creator: { uid: user.uid }, // Add creator field with uid sub-field
        });

        // Create a studygroups for the new event
        const socialgroupsRef = await addDoc(collection(db, "socialgroups"), {
          title: `New Event Created: ${eventName}`,
          description: `Created by ${creator.firstName} ${creator.surname} (${creator.email})`,
          image: "https://via.placeholder.com/150", // Replace with the actual image URL
          time: new Date().toLocaleString([], { timeZoneName: "short" }), // Current time with timezone abbreviation
          userId: user.uid, // Add the user's ID to the notification document
          eventId: eventRef.id, // Add the event's ID to the notification document
          tag: tag, // Set as string
          group: group, // Set as string
          creator: { uid: user.uid }, // Add creator field with uid sub-field
        });

        console.log(
          "StudyGroups document written with ID: ",
          studygroupsRef.id
        );
        console.log("Events before:", events);
        // Add the new event to the context
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            id: eventRef.id,
            name: eventName,
            location: eventLocation,
            description: eventDescription,
            creator: creator,
            invites: invites.split(",").map((email) => email.trim()),
            userId: user.uid,
            tag: tag, // Set as string
            group: group, // Set as string
          },
        ]);
        console.log("Events after:", events);
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
            <FormPicker
              onValueChange={(value) => setTag(value)} // Set as string
              items={[
                { label: "Computer Science", value: "Computer Science" },
                { label: "Cultural", value: "Cultural" },
                { label: "Dance", value: "Dance" },
              ]}
              placeholder={{ label: "Select a tag...", value: null }}
            />
            <FormPicker
              onValueChange={(value) => setGroup(value)} // Set as string
              items={[
                { label: "Study Group", value: "Study Group" },
                { label: "Social Group", value: "Social Group" },
              ]}
              placeholder={{ label: "Select a group...", value: null }}
            />

            <FormButton title="Create Event" onPress={createEvent} />
          </>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    width: "80%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default CreateEventScreen;
