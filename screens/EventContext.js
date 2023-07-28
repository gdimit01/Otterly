import React, { createContext, useState, useEffect } from "react";
import { getFirestore, collection, onSnapshot } from "@firebase/firestore"; // Import Firestore functions

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const db = getFirestore();
      const eventsCollection = collection(db, "events"); // Replace "events" with your actual collection name

      // Subscribe to the events collection
      const unsubscribe = onSnapshot(eventsCollection, (snapshot) => {
        let eventsData = [];
        snapshot.forEach((doc) => {
          eventsData.push({ id: doc.id, ...doc.data() });
        });
        setEvents(eventsData);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    };

    fetchEvents();
  }, []);

  return (
    <EventContext.Provider value={[events, setEvents]}>
      {children}
    </EventContext.Provider>
  );
};
