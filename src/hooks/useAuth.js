import { useState, useEffect } from "react";
import { useNavigation, useIsFocused } from "@react-navigation/core";
import { FIREBASE_AUTH as auth } from "../../firebaseConfig";
import { getFirestore, doc, getDoc } from "@firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuth = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    if (isFocused) {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        setUser(user);
        if (user) {
          const db = getFirestore();
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setFirstName(userData.firstName || "");
            setSurname(userData.surname || "");
            try {
              await AsyncStorage.setItem("user", JSON.stringify(user));
              await AsyncStorage.setItem("firstName", userData.firstName || "");
              await AsyncStorage.setItem("surname", userData.surname || "");
            } catch (err) {
              console.error(err);
            }
          } else {
            console.log("No such document!");
          }
        }
        setIsLoading(false); // Set loading to false once data is fetched
      });
      return unsubscribe;
    }
  }, [isFocused]);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Welcome");
        AsyncStorage.clear();
      })
      .catch((error) => alert(error.message));
  };

  return { user, firstName, surname, handleSignOut, isLoading }; // Return isLoading
};
