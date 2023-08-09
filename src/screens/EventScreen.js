import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment"; // Import moment.js
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  collection,
} from "@firebase/firestore";
import { FIREBASE_AUTH as auth } from "../../firebaseConfig";
import { EventContext } from "../context/EventContext";

const EventScreen = ({ route }) => {
  const navigation = useNavigation();
  const { events, updateEventVisibility } = useContext(EventContext);
  const event = route.params;
  const { tag, group } = event;

  const [invites, setInvites] = useState([]); // State to hold the invites

  // State to hold the attendees
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const invitesRef = collection(db, "events", event.id, "invites");

    // Subscribe to the invites collection
    const unsubscribeInvites = onSnapshot(invitesRef, (snapshot) => {
      const invitesData = snapshot.docs.map((doc) => doc.data().email); // Extract email from each invite
      setInvites(invitesData);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribeInvites();
    };
  }, [event.id]);

  useEffect(() => {
    const db = getFirestore();
    const eventRef = doc(db, "events", event.id);

    // Subscribe to the event document
    const unsubscribe = onSnapshot(eventRef, (snapshot) => {
      const eventData = snapshot.data();
      setAttendees(eventData?.attendees || []);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [event.id]);

  const handleInvitationResponse = async (response) => {
    try {
      const db = getFirestore();
      const user = auth.currentUser; // Get the currently logged-in user
      const eventRef = doc(db, "events", event.id);

      if (response === "accepted") {
        // Check if the attendees list exists
        if (event.attendees) {
          // Add the user's email to the attendees list
          await setDoc(
            eventRef,
            {
              attendees: [...event.attendees, user.email],
            },
            { merge: true }
          );
        } else {
          // If the attendees list doesn't exist, create it
          await setDoc(
            eventRef,
            {
              attendees: [user.email],
            },
            { merge: true }
          );
        }

        // Update invite status in Firestore
        const inviteRef = doc(db, `events/${event.id}/invites`, user.email);
        await setDoc(
          inviteRef,
          {
            status: "accepted",
          },
          { merge: true }
        );

        Alert.alert("Success", "You have accepted the invitation!"); // Show success message
      } else if (response === "declined") {
        // Update invite status in Firestore
        const inviteRef = doc(db, `events/${event.id}/invites`, user.email);
        await setDoc(
          inviteRef,
          {
            status: "declined",
          },
          { merge: true }
        );

        Alert.alert("Success", "You have declined the invitation."); // Show success message
      }

      navigation.goBack(); // Go back to the previous screen
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  // Convert the attendees array to a string
  const attendeesText = attendees.length
    ? attendees.join(", ")
    : "No attendees yet";

  // Convert the invites array to a string
  const invitesText = invites.length
    ? invites.join(", ") // Join the emails into a string
    : "No invites yet";

  // Use the visibility property from the event to display the current visibility
  const visibilityText = event.visibility ? "Public" : "Private";

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: StatusBar.currentHeight }]}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Event</Text>
        <Image
          source={{ uri: "https://via.placeholder.com/150" }}
          style={styles.mainImage}
        />
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.description}>{event.description}</Text>
        <Text style={styles.time}>
          {moment(event.time, "DD/MM/YYYY, HH:mm:ss Z").format(
            "MMMM Do YYYY, h:mm a"
          )}
        </Text>
        <Text style={styles.location}>Event Location{event.location}</Text>
        <Text style={styles.tag}>Tag: A{tag}</Text>
        <Text style={styles.group}>Group: B{group}</Text>
        <Text style={styles.visibility}>Visibility: {visibilityText}</Text>
        <Text style={styles.attendees}>Attendees: {attendeesText}</Text>
        <Text style={styles.invites}>Invites: {invitesText}</Text>
        <TouchableOpacity
          onPress={() => handleInvitationResponse("accepted")}
          style={styles.responseButton}
        >
          <Text style={styles.responseButtonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleInvitationResponse("declined")}
          style={styles.responseButton}
        >
          <Text style={styles.responseButtonText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Other styles...
  visibility: {
    fontSize: 14,
    marginBottom: 10,
  },
  responseButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  responseButtonText: {
    color: "#FFF",
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  mainImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  time: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  tag: {
    fontSize: 14,
    marginBottom: 10,
  },
  group: {
    fontSize: 14,
    marginBottom: 10,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    paddingBottom: 25,
  },
  backButtonText: {
    fontSize: 16,
    color: "blue",
  },
});

export default EventScreen;
