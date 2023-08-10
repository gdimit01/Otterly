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

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // For storing a selected event

  useEffect(() => {
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
        // Check if the event with the same id already exists in the eventsData array
        if (!eventsData.some((event) => event.id === eventData.id)) {
          eventData.time = moment(
            eventData.time,
            "DD/MM/YYYY, HH:mm:ss ZZ"
          ).format("MMMM Do YYYY, h:mm:ss a");
          eventsData.push(eventData);
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
      value={{ events, setEvents, updateEvent, selectedEvent, selectEvent }}
    >
      {children}
    </EventContext.Provider>
  );
};
