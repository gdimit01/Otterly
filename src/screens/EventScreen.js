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
import { getFirestore, collection, doc, getDocs } from "@firebase/firestore";

const EventScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { events } = useContext(EventContext);
  const eventId = route.params.id;
  const event = events.find((e) => e.id === eventId);

  // Directly access the time from the event object
  const time = event.time;
  const [attendees, setAttendees] = useState([]); // State variable to hold attendees

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
        <Image
          source={{ uri: "https://via.placeholder.com/150" }}
          style={styles.mainImage}
        />
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.description}>{event.description}</Text>
        <Text style={styles.time}>Time: {time}</Text>
        <Text style={styles.location}>Event Location: {event.location}</Text>
        <Text style={styles.tag}>Tag: {event.tag}</Text>
        <Text style={styles.group}>Group: {event.group}</Text>
        <Text style={styles.visibility}>
          Visibility: {event.visibility ? "Public" : "Private"}
        </Text>
        <Text style={styles.attendees}>Attendees: {attendees.join(", ")}</Text>
        <Text style={styles.invites}>Invites: {event.invites.join(", ")}</Text>
        {/* Additional JSX can be added here */}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
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
