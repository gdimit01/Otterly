import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  where,
} from "@firebase/firestore";
import { FIREBASE_AUTH as auth } from "../../firebaseConfig"; // Import auth
import SocialGroupsCard from "../../src/components/SocialGroups/SocialGroupsCard";

const SocialGroupsScreen = () => {
  const isFocused = useIsFocused();
  const [events, setEvents] = useState([]);
  const currentUser = auth.currentUser; // Get the current user

  useEffect(() => {
    if (isFocused) {
      const db = getFirestore();
      const q = query(
        collection(db, "events"),
        where("group", "==", "Social Group")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let socialGroupsData = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          // Check if the event is public or the current user is invited
          if (data.visibility || data.creator.email === currentUser.email) {
            socialGroupsData.push({ id: doc.id, ...data });
          }
        });
        setEvents(socialGroupsData);
      });

      return () => unsubscribe();
    }
  }, [isFocused]);

  const renderItem = ({ item }) => {
    const currentUserEmail = auth.currentUser.email; // Assuming you have access to the auth object
    // Check if the event is public or the current user is the creator
    if (item.visibility || item.creator.email === currentUserEmail) {
      return (
        <SocialGroupsCard
          id={item.id}
          creator={item.creator} // Pass the creator object
          title={item.name}
          description={item.description}
          image={item.image}
          time={item.time}
          group={item.group}
          tag={item.tag}
          visibility={item.visibility}
          attendees={item.attendees} // Pass the attendees count
        />
      );
    }
    return null; // Return null if the current user should not see the event
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Social Groups</Text>
        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  content: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
  },
  text: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    marginTop: 5,
  },
  time: {
    fontSize: 14,
    marginTop: 5,
    color: "#888",
  },
  group: {
    color: "#0000FF", // Default blue color
    fontSize: 12,
    fontWeight: "bold",
    position: "absolute", // Position it absolutely
  },
  tag: {
    color: "#0000FF", // Default blue color
    fontSize: 12,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#ff0000",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteText: {
    color: "#ffffff",
    textAlign: "center",
  },
});

export default SocialGroupsScreen;
