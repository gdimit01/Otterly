// CreateEventFunction.js
import React, { useContext } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  doc,
  onSnapshot,
  setDoc,
} from "@firebase/firestore";
import { Alert } from "react-native";
import { FIREBASE_AUTH as auth } from "../../../firebaseConfig";
import { EventContext } from "../../context/EventContext"; // Import EventContext
import AsyncStorage from "@react-native-async-storage/async-storage";

const db = getFirestore();

const CreateEventFunction = ({
  eventName,
  eventLocation,
  eventDescription,
  creator,
  invites,
  tag,
  group,
}) => {
  const [events, setEvents] = useContext(EventContext);

  const createEvent = async () => {
    try {
      const user = auth.currentUser; // Get the currently logged-in user
      if (user) {
        const creatorData = creator || {}; // if creator is undefined, use an empty object

        const eventRef = doc(collection(db, "events")); // Create a new document reference with an auto-generated ID
        await setDoc(eventRef, {
          name: eventName,
          location: eventLocation,
          description: eventDescription,
          creator: creatorData,
          invites: invites
            .split(",")
            .map((email) => ({ email: email.trim(), status: "pending" })),
          userId: user.uid, // Add the user's ID to the event document
          tag: tag, // Set as string
          group: group, // Set as string
        });

        // Create an invites collection in each event document
        await Promise.all(
          invites.split(",").map(async (email) => {
            await setDoc(
              doc(collection(db, "events", eventRef.id, "invites")),
              {
                email: email.trim(),
                status: "pending",
              }
            );
          })
        );

        // Create a notification for the new event
        const notificationRef = doc(collection(db, "notifications")); // Create a new document reference with an auto-generated ID
        await setDoc(notificationRef, {
          title: `New Event Created: ${eventName}`,
          description: `Created by ${creatorData.firstName || ""} ${
            creatorData.surname || ""
          } (${creatorData.email || ""})`,

          image: "https://via.placeholder.com/150", // Replace with the actual image URL
          time: new Date().toLocaleString([], { timeZoneName: "short" }), // Current time with timezone abbreviation
          userId: user.uid, // Add the user's ID to the notification document
          eventId: eventRef.id, // Add the event's ID to the notification document
          tag: tag, // Set as string
          group: group, // Set as string
        });

        // Create a studygroups for the new event
        const studyGroupRef = doc(collection(db, "studygroups")); // Create a new document reference with an auto-generated ID
        await setDoc(studyGroupRef, {
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

        // Create a socialgroups for the new event
        const socialGroupRef = doc(collection(db, "socialgroups")); // Create a new document reference with an auto-generated ID
        await setDoc(socialGroupRef, {
          title: `New Event Created: ${eventName}`,
          description: `Created by ${creator.firstName} ${creator.surname} (${creator.email})`,
          image: "https://loremflickr.com/150/150?random=9000", // Replace with the actual image URL
          time: new Date().toLocaleString([], { timeZoneName: "short" }), // Current time with timezone abbreviation
          userId: user.uid, // Add the user's ID to the notification document
          eventId: eventRef.id, // Add the event's ID to the notification document
          tag: tag, // Set as string
          group: group, // Set as string
          creator: { uid: user.uid }, // Add creator field with uid sub-field
        });

        // Add the new event to the context
        let newEvent = {
          id: eventRef.id,
          name: eventName,
          location: eventLocation,
          description: eventDescription,
          creator: creatorData,
          invites: invites.split(",").map((email) => email.trim()),
          userId: user.uid,
          tag: tag,
          group: group,
        };
        setEvents((prevEvents) => [
          ...(prevEvents || []), // Here, if prevEvents is undefined, an empty array will be used
          newEvent,
        ]);

        // Save the event ID to AsyncStorage
        await AsyncStorage.setItem("lastCreatedEventId", eventRef.id);

        Alert.alert("Success", "Event successfully created"); // Show success message
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return createEvent;
};

export default CreateEventFunction;
