// CreateEventScreen.js
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
import { getFirestore, getDoc, doc, onSnapshot } from "@firebase/firestore";
import { FIREBASE_AUTH as auth } from "../../firebaseConfig";
import CreateEventFunction from "../../src/components/CreateEventsGroup/CreateEventFunction"; // Import CreateEventFunction
import FormButton from "../../components/FormButton";
import FormInput from "../../components/FormInput";
import FormPicker from "../../components/FormPicker";

const db = getFirestore();

const CreateEventScreen = () => {
  const [creator, setCreator] = useState("");
  const [invites, setInvites] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [tag, setTag] = useState(null); // Initialize as null
  const [group, setGroup] = useState(null); // Initialize as null

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
    return () => unsubscribe;
  }, []);

  const createEvent = CreateEventFunction({
    eventName,
    eventLocation,
    eventDescription,
    creator,
    invites,
    tag,
    group,
  });

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
