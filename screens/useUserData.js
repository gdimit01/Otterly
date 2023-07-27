import { useState, useEffect } from "react";
import { FIREBASE_AUTH as auth } from "../firebaseConfig";
import { getFirestore, doc, onSnapshot } from "@firebase/firestore";

export const useUserData = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const db = getFirestore();
        const docRef = doc(db, "users", user.uid);

        const unsubscribeSnapshot = onSnapshot(
          docRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setUserData(docSnap.data());
            } else {
              console.log("No such document!");
            }
          },
          (error) => {
            console.error("Error getting document:", error);
          }
        );

        // Cleanup subscription on unmount
        return () => {
          unsubscribe();
          unsubscribeSnapshot();
        };
      }

      // If no user is signed in, set userData to null
      setUserData(null);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  return userData;
};
