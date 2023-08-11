import React, { useContext, useCallback } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDocs,
} from "@firebase/firestore";
import { Alert } from "react-native";
import { FIREBASE_AUTH as auth } from "../../../firebaseConfig";
import { EventContext } from "../../context/EventContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment-timezone";
import _ from "lodash"; // Import lodash for debouncing

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
  const { setEvents } = useContext(EventContext) || {
    setEvents: () => {},
  };

  // Function to fetch events from Firestore
  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "events"));
      const events = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(events);
      console.log("Events fetched from Firestore:", events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const createEvent = useCallback(
    _.debounce(async () => {
      console.log("Creating event...");
      try {
        // Validate user
        const user = auth.currentUser;
        if (user) {
          // Process invites
          const invitesProcessed = processInvites(invites);

          // Format the time using moment.js in BST timezone
          formattedTime = moment(time)
            .tz("Europe/London")
            .format("DD/MM/YYYY, HH:mm:ss ZZ");
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

          // Re-fetch events from Firestore
          await fetchEvents();

          Alert.alert("Success", "Event successfully created");
          onSuccess();
        }
      } catch (e) {
        console.error("Error adding document: ", e);
        Alert.alert("Error", "Failed to create event. Please try again.");
      }
    }, 100),
    [
      eventName,
      eventLocation,
      eventDescription,
      creator,
      invites,
      tag,
      group,
      time,
    ]
  ); // Debounce time is 1000ms

  return createEvent;
};

export default CreateEventFunction;
