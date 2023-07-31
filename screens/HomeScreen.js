import { useNavigation, useIsFocused } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  View,
  StatusBar,
} from "react-native";
import { FIREBASE_AUTH as auth } from "../firebaseConfig";
import { getFirestore, doc, getDoc } from "@firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const HomeScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");

  const activities = [
    { id: "1", title: "Activity 1", image: "https://via.placeholder.com/150" },
    { id: "2", title: "Activity 2", image: "https://via.placeholder.com/150" },
    { id: "3", title: "Activity 3", image: "https://via.placeholder.com/150" },
    { id: "4", title: "Activity 4", image: "https://via.placeholder.com/150" },
    { id: "5", title: "Activity 5", image: "https://via.placeholder.com/150" },
  ];

  useEffect(() => {
    if (isFocused) {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        console.log("Auth state changed:", user);
        setUser(user);

        if (user) {
          const db = getFirestore();
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setFirstName(docSnap.data().firstName);
            setSurname(docSnap.data().surname);
            // Save user data to AsyncStorage
            try {
              await AsyncStorage.setItem("user", JSON.stringify(user));
              await AsyncStorage.setItem("firstName", docSnap.data().firstName);
              await AsyncStorage.setItem("surname", docSnap.data().surname);
            } catch (err) {
              console.error(err);
            }
          } else {
            console.log("No such document!");
          }
        }
      });

      return unsubscribe;
    }
  }, [isFocused]);

  //This fixed the black bar issue on Android
  useEffect(() => {
    StatusBar.setBarStyle("dark-content");
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor("transparent");
      StatusBar.setTranslucent(true);
    }
  }, []);
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Welcome");
        // Clear AsyncStorage after sign out
        AsyncStorage.clear();
      })
      .catch((error) => alert(error.message));
  };

  const renderActivity = ({ item }) => (
    <View style={styles.activityContainer}>
      <Image source={{ uri: item.image }} style={styles.activityImage} />
      <Text style={styles.activityTitle}>{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Home</Text>
      <ScrollView contentContainerStyle={styles.container}>
        {user ? (
          <View style={styles.userInfoContainer}>
            <Text style={styles.greetingText}>
              Hi {firstName} {surname}
            </Text>
            <Text>Email: {user.email}</Text>
          </View>
        ) : (
          <Text>No user is signed in.</Text>
        )}
        <View style={styles.card}>
          <Text style={styles.cardText}>Explore more upcoming events</Text>
        </View>
        <View style={styles.activitiesContainer}>
          <FlatList
            horizontal
            data={activities}
            renderItem={renderActivity}
            keyExtractor={(item) => item.id}
          />
        </View>
        <View style={styles.calendarCard}>
          <Text style={styles.cardText}>Calendar</Text>
          <Image
            source={{ uri: "https://via.placeholder.com/300" }}
            style={styles.calendarImage}
          />
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.button}>
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
export default HomeScreen;

// ... rest of your code

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  activitiesContainer: {
    height: 150, // Adjust this value as needed

    backgroundColor: "transparent", // Set the background color to transparent
  },
  activityContainer: {
    margin: 10,
    alignItems: "center",
    backgroundColor: "transparent", // Set the background color to transparent
  },
  card: {
    width: "100%", // Adjust as needed
    height: 100, // Adjust as needed
    padding: 30, // Increase padding
    marginBottom: 20, // Adjust as needed
    backgroundColor: "#f8f8f8", // Adjust as needed
    borderRadius: 10, // Adjust as needed
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    fontSize: 16, // Adjust as needed
    fontWeight: "bold", // Adjust as needed
  },
  calendarCard: {
    width: "100%", // Adjust as needed
    padding: 20, // Adjust as needed
    marginBottom: 20, // Adjust as needed
    backgroundColor: "#f8f8f8", // Adjust as needed
    borderRadius: 10, // Adjust as needed
    justifyContent: "center",
    alignItems: "center",
  },
  calendarImage: {
    width: "100%", // Adjust as needed
    height: 200, // Adjust as needed
    resizeMode: "cover", // Adjust as needed
  },
  userInfoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  activityContainer: {
    margin: 10,
    alignItems: "center",
  },
  activityImage: {
    width: 100,
    height: 100,
  },
  activityTitle: {
    marginTop: 10,
  },
  greetingText: {
    fontSize: 20, // this sets the font size
    color: "#000000", // this sets the text color
    fontWeight: "bold", // this makes the text bold
    // You can add any other styles you want here. Some examples:
    fontStyle: "italic",
    textDecorationLine: "underline",
  },
});
