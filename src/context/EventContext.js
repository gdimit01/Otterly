import React, { createContext, useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  updateDoc,
} from "@firebase/firestore";

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const eventsCollection = collection(db, "events");

    // Subscribe to the events collection
    const unsubscribeEvents = onSnapshot(eventsCollection, (snapshot) => {
      let eventsData = [];
      snapshot.forEach((doc) => {
        eventsData.push({ id: doc.id, ...doc.data() });
      });
      console.log(eventsData); // Log events
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
    } catch (error) {
      console.error("Error updating event: ", error);
    }
  };

  return (
    <EventContext.Provider value={{ events, setEvents, updateEvent }}>
      {children}
    </EventContext.Provider>
  );
};
