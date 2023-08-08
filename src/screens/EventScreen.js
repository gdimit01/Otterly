import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  FlatList,
  StatusBar,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment"; // Import moment.js

// Import Firestore methods and the auth object
import { getFirestore, doc, setDoc } from "@firebase/firestore";
import { FIREBASE_AUTH as auth } from "../../firebaseConfig";

// Import the EventContext
import { EventContext } from "../context/EventContext";

const EventScreen = ({ route }) => {
  const navigation = useNavigation();
  const { events, updateEventVisibility } = useContext(EventContext);

  // Data from the NotificationCard
  const event = route.params;

  // Retrieve the selected tag and group from the navigation parameters
  const { tag, group } = event;

  const handleInvitationResponse = async (response) => {
    try {
      const db = getFirestore();
      const user = auth.currentUser; // Get the currently logged-in user
      const eventRef = doc(db, "events", event.id);

      if (response === "accepted") {
        // Check if the attendees list exists
        if (event.attendees) {
          // Add the user's ID to the attendees list
          await setDoc(
            eventRef,
            {
              attendees: [...event.attendees, user.uid],
            },
            { merge: true }
          );
        } else {
          // If the attendees list doesn't exist, create it
          await setDoc(
            eventRef,
            {
              attendees: [user.uid],
            },
            { merge: true }
          );
        }

        // Update invite status in Firestore
        const inviteRef = doc(db, `events/${event.id}/invites`, user.uid);
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
        const inviteRef = doc(db, `events/${event.id}/invites`, user.uid);
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

        {/* Display the tag and group */}
        <Text style={styles.tag}>Tag: A{tag}</Text>
        <Text style={styles.group}>Group: B{group}</Text>

        {/* Display the visibility */}
        <Text style={styles.visibility}>Visibility: {visibilityText}</Text>

        {/* Accept and Decline buttons */}
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
