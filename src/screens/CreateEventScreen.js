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
import CreateEventFunction from "../../src/components/CreateEventsGroup/CreateEventFunction"; // Import CreateEventFunction
import FormButton from "../../components/FormButton";
import FormInput from "../../components/FormInput";
import FormPicker from "../../components/FormPicker";
import { useAuth } from "../../src/hooks/useAuth"; // replace with your actual path to the useAuth file

const CreateEventScreen = () => {
  const { user, firstName, surname } = useAuth();
  console.log(`User: ${firstName} ${surname}`);
  console.log(`Email: ${user?.email}`);

  const [creator, setCreator] = useState(null);
  const [invites, setInvites] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [tag, setTag] = useState(null); // Initialize as null
  const [group, setGroup] = useState(null); // Initialize as null

  useEffect(() => {
    if (user && !creator) {
      // If user is logged in and creator is null
      setCreator({
        email: user.email,
        firstName: firstName,
        surname: surname,
      });
    }
  }, [user, firstName, surname]);

  const createEvent = CreateEventFunction({
    eventName,
    eventLocation,
    eventDescription,
    creator,
    invites,
    tag,
    group,
  });

  // rest of the code...

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
