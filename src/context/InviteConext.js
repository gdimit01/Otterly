// InviteContext.js
import React, { createContext, useState, useEffect } from "react";
import { getFirestore, collection, onSnapshot } from "@firebase/firestore"; // Import Firestore functions

export const InviteContext = createContext();

export const InviteProvider = ({ children }) => {
  const [invites, setInvites] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const invitesCollection = collection(db, "invitations");

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
      unsubscribeInvites();
    };
  }, []);

  return (
    <InviteContext.Provider value={invites}>{children}</InviteContext.Provider>
  );
};
