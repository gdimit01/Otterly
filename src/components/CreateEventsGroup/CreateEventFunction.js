import React, { useContext } from "react";
import { getFirestore, collection, addDoc, doc } from "@firebase/firestore";
import { Alert } from "react-native";
import { FIREBASE_AUTH as auth } from "../../../firebaseConfig";
import { EventContext } from "../../context/EventContext"; // Import EventContext
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment-timezone"; // Import moment-timezone to handle time zones

const db = getFirestore();

// Function to process invites
const processInvites = (invitesString) => {
  return invitesString
    .split(",")
    .map((email) => ({ email: email.trim(), status: "pending" }));
};

const CreateEventFunction = ({
  eventName,
  eventLocation,
  eventDescription,
  creator,
  invites,
  tag,
  group,
  time,
  onSuccess,
}) => {
  // Validation can be added here for the input fields
  const { events, setEvents } = useContext(EventContext) || {
    events: [],
    setEvents: () => {},
  };

  const createEvent = async () => {
    try {
      // Validate user
      const user = auth.currentUser;
      if (user) {
        // Process invites
        const invitesProcessed = processInvites(invites);

        // Format the time using moment.js in BST timezone
        formattedTime = moment(time)
          .tz("Europe/London") // Set the timezone to London, which observes BST
          .format("DD/MM/YYYY, HH:mm:ss ZZ"); // Format the time as desired

        // Create the event in Firestore
        const eventRef = await addDoc(collection(db, "events"), {
          name: eventName,
          location: eventLocation,
          description: eventDescription,
          creator: creator,
          userId: user.uid,
          tag: tag,
          group: group,
          invites: invitesProcessed,
          likes: 0, // Initialize likes
          rsvp: [], // Initialize RSVP list
          image:
            group === "Social Groups"
              ? "https://via.placeholder.com/150"
              : "https://loremflickr.com/150/150?random=9000",
          time: formattedTime, // Store the formatted time in the Firestore document
        });

        // Create attendees subcollection
        const attendeesRef = collection(
          doc(db, "events", eventRef.id),
          "attendees"
        );
        // You can add attendees to this subcollection as needed

        // Create a notification for the new event within the event's subcollection
        await addDoc(
          collection(doc(db, "events", eventRef.id), "notifications"),
          {
            title: `New Event Created: ${eventName}`,
            description: `Created by ${creator.firstName} ${creator.surname} (${creator.email})`,
            image: "https://via.placeholder.com/150", // Replace with the actual image URL
            time: moment().format(), // Consider using moment.js for date formatting
            userId: user.uid,
            eventId: eventRef.id,
            tag: tag,
            group: group,
          }
        );

        // Construct the new event object
        let newEvent = {
          id: eventRef.id,
          name: eventName,
          location: eventLocation,
          description: eventDescription,
          creator: creator,
          invites: invitesProcessed,
          userId: user.uid,
          tag: tag,
          group: group,
          likes: 0, // Initialize likes
          rsvp: [], // Initialize RSVP list
          attendees: [], // Initialize attendees list
        };

        // Update the context
        setEvents((prevEvents) => [...(prevEvents || []), newEvent]);

        // Optionally save the event ID to AsyncStorage
        await AsyncStorage.setItem("lastCreatedEventId", eventRef.id);

        Alert.alert("Success", "Event successfully created");
        onSuccess();
      }
    } catch (e) {
      console.error("Error adding document: ", e);
      Alert.alert("Error", "Failed to create event. Please try again."); // Enhanced error handling
    }
  };

  return createEvent;
};

export default CreateEventFunction;
