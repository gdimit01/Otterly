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

const EventScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { events } = useContext(EventContext);
  const eventId = route.params.id;
  const event = events.find((e) => e.id === eventId);
  const [eventData, setEventData] = useState(event);

  // Directly access the time from the event object
  const time = event.time;
  const [attendees, setAttendees] = useState([]); // State variable to hold attendees

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
      setAttendees(attendeesList);
    };

    fetchAttendees();
  }, [eventId]);

  const toggleNotification = async () => {
    try {
      const db = getFirestore();
      const eventRef = doc(db, "events", eventId);
      // Toggle the notification field
      await updateDoc(eventRef, {
        notification: !event.notification,
      });
      Alert.alert(
        "Success",
        `Notification ${
          event.notification ? "removed" : "added"
        } for this event`
      );
    } catch (error) {
      console.error("Error updating notification:", error);
      Alert.alert("Error", "Failed to update notification. Please try again.");
    }
  };

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

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: StatusBar.currentHeight }]}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Event</Text>
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
              uri: "https://via.placeholder.com/150", // Add the URL for Study Group image
            }}
            style={styles.mainImage}
          />
        )}
        <Text style={styles.name}>Event Name: {event.name}</Text>
        <Text style={styles.description}>
          Event Description: {event.description}
        </Text>
        <Text style={styles.time}>Time: {time}</Text>
        <Text style={styles.location}>Event Location: {event.location}</Text>
        <Text style={styles.tag}>Tag: {event.tag}</Text>
        <Text style={styles.group}>Group: {event.group}</Text>
        <Text style={styles.visibility}>
          Visibility: {event.visibility ? "Public" : "Private"}
        </Text>
        <Text style={styles.attendees}>Attendees: {attendees.join(", ")}</Text>
        <Text style={styles.invites}>
          Invites: {event.invites.map((invitee) => invitee.email).join(", ")}
        </Text>
        {/* Additional JSX can be added here */}
        <InvitesActions event={eventData} eventId={eventId} />
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={toggleNotification}
        >
          <Text style={styles.notificationButtonText}>
            {event.notification
              ? "Remove from Notifications"
              : "Add to Notifications"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  visibility: {
    fontSize: 14,
    marginBottom: 10,
  },
  notificationButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  notificationButtonText: {
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
