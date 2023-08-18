/**
 * The code is a React Native component that displays details of an event and allows users to
 * leave messages and perform actions on the event.
 * @returns The `EventScreen` component is being returned.
 */
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Button,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import moment from "moment"; // Import moment.js
import { EventContext } from "../context/EventContext";
import {
  onSnapshot,
  getFirestore,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "@firebase/firestore";
import InvitesActions from "../../src/components/InvitesGroup/InvitesActions"; // Adjust the path as needed
import { FontAwesome } from "@expo/vector-icons";

const EventScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { events } = useContext(EventContext);
  const eventId = route.params.id;
  const event = events.find((e) => e.id === eventId);
  const [eventData, setEventData] = useState(event);

  const [messageInput, setMessageInput] = useState("");

  // Directly access the time from the event object
  const time = event.time;
  //const { handleRSVP, attendees } = useContext(EventContext);

  useEffect(() => {
    const db = getFirestore();
    const eventRef = doc(db, "events", eventId);

    // Subscribe to changes in the event document
    const unsubscribe = onSnapshot(eventRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setEventData(docSnapshot.data());
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [eventId]);

  useEffect(() => {
    const fetchAttendees = async () => {
      const db = getFirestore();
      const attendeesRef = collection(db, "events", eventId, "attendees");
      const attendeesSnapshot = await getDocs(attendeesRef);
      const attendeesList = attendeesSnapshot.docs.map(
        (doc) => doc.data().email
      ); // Assuming email is the field you want
      //setAttendees(attendeesList);
    };

    fetchAttendees();
  }, [eventId]);

  useEffect(() => {
    console.log("Event from EventContext:", event); // Log the event for debugging
  }, [event]);

  if (!event) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  const leaveMessage = async () => {
    // Logic to save the message to the database
    // You can customize this part based on your needs
    try {
      // Example: Save the message to Firestore
      const db = getFirestore();
      const messagesRef = collection(db, "events", eventId, "messages");
      await addDoc(messagesRef, {
        text: messageInput,
        timestamp: new Date().toISOString(),
      });
      Alert.alert("Success", "Message left successfully!");
      setMessageInput(""); // Clear the input
    } catch (error) {
      console.error("Error leaving message:", error);
      Alert.alert("Error", "Failed to leave the message. Please try again.");
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: StatusBar.currentHeight }]}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Event</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {event.group === "Social Group" ? (
            <Image
              source={{
                uri: "https://loremflickr.com/150/150?random=9000", // Add the URL for Social Group image
              }}
              style={styles.mainImage}
            />
          ) : (
            <Image
              source={{
                uri: "https://via.placeholder.com/155", // Add the URL for Study Group image
              }}
              style={styles.mainImage}
            />
          )}
          <Text style={styles.name}>Event Name: {event.name}</Text>
          <Text style={styles.description}>
            Event Description: {event.description}
          </Text>
          <Text style={styles.creatorName}>
            Created by: {event.creator.firstName} {event.creator.surname} (
            {event.creator.email})
          </Text>
          <Text style={styles.time}>Created at: {time}</Text>
          <Text style={styles.location}>Event Location: {event.location}</Text>
          <Text style={styles.tag}>Tag: {event.tag}</Text>
          <Text style={styles.group}>Group: {event.group}</Text>
          <Text style={styles.visibility}>
            Visibility: {event.visibility ? "Public" : "Private"}
          </Text>
          <Text
            style={styles.attendeesText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Attendees: {event.attendees}
          </Text>
          <Text style={styles.invites}>
            Invites:{" "}
            {event.invites
              .map((invitee) => `${invitee.email} - ${invitee.status}`)
              .join(", ")}
          </Text>

          <Text style={styles.likes}>Likes: {event.likes}</Text>

          <InvitesActions event={eventData} eventId={eventId} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  mainImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  creatorName: {
    fontSize: 18,
    marginBottom: 20,
    color: "#555",
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    color: "#555",
  },
  time: {
    fontSize: 16,
    color: "#888",
    marginBottom: 10,
  },
  location: {
    fontSize: 16,
    color: "#888",
    marginBottom: 10,
  },
  tag: {
    fontSize: 16,
    color: "#888",
    marginBottom: 10,
  },
  group: {
    fontSize: 16,
    color: "#888",
    marginBottom: 10,
  },
  visibility: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
  },
  attendeesText: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
  },
  invites: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
  },
  likes: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
  },
});

export default EventScreen;
