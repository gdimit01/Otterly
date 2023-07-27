// UserProvider.js

import React, { createContext, useState, useContext, useEffect } from "react";
import { getDoc, doc, getFirestore } from "@firebase/firestore";
import { FIREBASE_APP as db } from "../firebaseConfig"; // Update this import path to the actual location of your firebaseConfig
import { FIREBASE_AUTH as auth } from "../firebaseConfig";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const db = getFirestore();
        const docRef = doc(db, "users", firebaseUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: docSnap.data().firstName,
          });
        } else {
          console.log("No such document!");
        }
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserData = () => useContext(UserContext);
