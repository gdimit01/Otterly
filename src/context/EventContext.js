import React, { createContext, useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  updateDoc,
} from "@firebase/firestore"; // Import Firestore functions

export const EventContext = createContext();
export const InviteContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const eventsCollection = collection(db, "events");
    const invitesCollection = collection(db, "invitations");

    // Subscribe to the events collection
    const unsubscribeEvents = onSnapshot(eventsCollection, (snapshot) => {
      let eventsData = [];
      snapshot.forEach((doc) => {
        eventsData.push({ id: doc.id, ...doc.data() });
      });
      console.log(eventsData); // Log events
      setEvents(eventsData);
    });

    // Subscribe to the invitations collection
    const unsubscribeInvites = onSnapshot(invitesCollection, (snapshot) => {
      let invitesData = [];
      snapshot.forEach((doc) => {
        invitesData.push({ id: doc.id, ...doc.data() });
      });
      console.log(invitesData); // Log invites
      setInvites(invitesData);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribeEvents();
      unsubscribeInvites();
    };
  }, []);

  // Function to update event visibility
  const updateEventVisibility = async (eventId, visibility) => {
    try {
      const db = getFirestore();
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, { visibility });
    } catch (error) {
      console.error("Error updating event visibility: ", error);
    }
  };

  return (
    <EventContext.Provider value={{ events, setEvents, updateEventVisibility }}>
      <InviteContext.Provider value={invites}>
        {children}
      </InviteContext.Provider>
    </EventContext.Provider>
  );
};

// EventContext is a React Context. In simple terms, it's a way to pass data through the component tree without having to pass props down manually at every level. This concept is particularly useful when sharing global data that many components might need to know about, like user authentication, theme, or in your case, event data.

// In your code, EventContext is created using createContext() from React. You also have EventProvider, which is a component that wraps around parts of your app that need access to the context value (the events data in this case).

// Here's how EventContext and EventProvider are working in your case:

// The EventProvider component uses a state hook (useState()) to keep track of events (an array of event data). This state is initialized as an empty array.

// An useEffect hook inside EventProvider is used to fetch events data from Firestore. This effect runs once when the EventProvider mounts because the dependency array of useEffect is empty ([]).

// Inside the useEffect hook, a snapshot listener (onSnapshot) is set up to listen for any changes in the 'events' collection in Firestore. Whenever there is a change (e.g., new event added, existing event updated, or event deleted), the snapshot listener triggers, providing a new snapshot of the entire 'events' collection.

// The new snapshot is used to create a new eventsData array, which is then used to update the events state.

// The EventProvider returns a context provider (EventContext.Provider) that wraps around children. children refers to any React elements or components that will be wrapped by EventProvider. This context provider is passing the events state and the setEvents function (used to update this state) as its value.

// This means that any component wrapped by EventProvider (or any of their children, grandchildren, etc.) can access the events state and the setEvents function using the useContext(EventContext) hook. This is what happens in your StudyGroupsScreen and SocialGroupsScreen components: they both access the events state and use it to display a list of events.

// So, in essence, EventContext allows you to fetch your events data once in EventProvider and then use and/or update this data in many different components without having to pass it down manually through props.
