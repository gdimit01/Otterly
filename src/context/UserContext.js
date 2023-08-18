/* The code is defining a React context called `UserContext` and a provider component called
`UserProvider`. */
// UserContext.js
import React, { createContext, useState, useEffect } from "react";
import { FIREBASE_AUTH as auth } from "../../firebaseConfig";
import { getFirestore, doc, onSnapshot } from "@firebase/firestore";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        const db = getFirestore();
        const docRef = doc(db, "users", user.uid);
        const unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setFirstName(userData.firstName || "");
            setSurname(userData.surname || "");
          } else {
            console.log("No such document!");
          }
        });
        return unsubscribeDoc;
      }
    });
    return unsubscribe;
  }, []);

  return (
    <UserContext.Provider value={{ user, firstName, surname }}>
      {children}
    </UserContext.Provider>
  );
};
