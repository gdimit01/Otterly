import React, { createContext, useState, useEffect } from "react";
import { getFirestore, collection, onSnapshot } from "@firebase/firestore"; // Import Firestore functions

export const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const messagesCollection = collection(db, "messages");

    // Subscribe to the messages collection
    const unsubscribeMessages = onSnapshot(messagesCollection, (snapshot) => {
      let messagesData = [];
      snapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() });
      });
      console.log(messagesData); // Log messages
      setMessages(messagesData);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribeMessages();
    };
  }, []);

  return (
    <MessageContext.Provider value={messages}>
      {children}
    </MessageContext.Provider>
  );
};
