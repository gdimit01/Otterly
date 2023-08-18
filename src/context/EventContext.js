import React, { createContext, useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
} from "@firebase/firestore";
import moment from "moment-timezone"; // Import moment-timezone
import { getAuth } from "firebase/auth"; // Import getAuth

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // For storing a selected event
  const [notifications, setNotifications] = useState([]); // For storing notifications

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser; // Get the current user

    const db = getFirestore();
    const eventsCollection = collection(db, "events");

    // Query to get events where group is either "Study Group" or "Social Group"
    const q = query(
      eventsCollection,
      where("group", "in", ["Study Group", "Social Group"])
    );

    // Subscribe to the events collection
    const unsubscribeEvents = onSnapshot(q, (snapshot) => {
      let eventsData = [];
      snapshot.forEach((doc) => {
        const eventData = { id: doc.id, ...doc.data() };

        // If the event is public, include it
        if (!eventData.private) {
          eventData.time = moment(
            eventData.time,
            "DD/MM/YYYY, HH:mm:ss ZZ"
          ).format("MMMM Do YYYY, h:mm:ss a");
          eventsData.push(eventData);
          return;
        }

        // If the current user created the event, include it
        if (
          eventData.creator &&
          eventData.creator.email === currentUser.email
        ) {
          eventData.time = moment(
            eventData.time,
            "DD/MM/YYYY, HH:mm:ss ZZ"
          ).format("MMMM Do YYYY, h:mm:ss a");
          eventsData.push(eventData);
          return;
        }

        // If the current user was invited to the event, include it
        if (
          eventData.invites &&
          eventData.invites.includes(currentUser.email)
        ) {
          eventData.time = moment(
            eventData.time,
            "DD/MM/YYYY, HH:mm:ss ZZ"
          ).format("MMMM Do YYYY, h:mm:ss a");
          eventsData.push(eventData);
          return;
        }
      });

      console.log("Fetched EventContext:", eventsData); // Log the fetched EventContext
      setEvents(eventsData);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribeEvents();
    };
  }, []);

  const addNotification = (event, user) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      {
        type: "RSVP",
        event,
        user,
        timestamp: new Date(),
      },
    ]);
  };

  useEffect(() => {
    const db = getFirestore();

    events.forEach((event) => {
      const rsvpRef = collection(db, "events", event.id, "RSVP");
      const unsubscribeRSVP = onSnapshot(rsvpRef, (rsvpSnapshot) => {
        rsvpSnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const user = change.doc.data();
            addNotification(event, user);
          }
        });
      });

      // Remember to unsubscribe when the component unmounts
      return () => unsubscribeRSVP();
    });
  }, [events]);

  // Function to update an event
  const updateEvent = async (eventId, updatedEvent) => {
    try {
      const db = getFirestore();
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, updatedEvent);
      console.log("Updated Event:", updatedEvent); // Log the updated event
    } catch (error) {
      console.error("Error updating event: ", error);
    }
  };

  // Function to select an event
  const selectEvent = (eventId) => {
    const event = events.find((event) => event.id === eventId);
    console.log("Selected Event:", event); // Log the selected event
    setSelectedEvent(event);
  };

  return (
    <EventContext.Provider
      value={{
        events,
        setEvents,
        updateEvent,
        selectedEvent,
        selectEvent,
        notifications,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
