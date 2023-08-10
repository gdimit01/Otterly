import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { EventContext } from "../../src/context/EventContext"; // Import EventContext
import SocialGroupsCard from "../components/SocialGroups/SocialGroupsCard"; // Import SocialGroupsCard
import { FIREBASE_AUTH as auth } from "../../firebaseConfig"; // Adjust the path as needed

const SocialGroupsScreen = () => {
  const { events = [] } = useContext(EventContext); // Get events from context

  const filteredEvents = events.filter(
    (event) => event.group === "Social Group"
  ); // Filter events

  console.log("Filtered events:", filteredEvents); // Log the filtered events

  useEffect(() => {
    console.log("Social Groups Events:", filteredEvents); // Log the events for debugging
  }, [filteredEvents]);

  useEffect(() => {
    console.log("All Events:", events);
  }, [events]);
  console.log("Filtered events:", filteredEvents); // Log the filtered events

  useEffect(() => {
    console.log("Social Groups Events:", filteredEvents); // Log the events for debugging
  }, [filteredEvents]);

  useEffect(() => {
    console.log("All Events:", events);
  }, [events]);

  /**
   * The function `renderItem` checks if the current user has permission to view an item and renders a
   * component if they do.
   * @returns The function `renderItem` returns either a `<SocialGroupsCard>` component or `null`.
   */
  const renderItem = ({ item }) => {
    const currentUserEmail = auth.currentUser.email;
    const hasAcceptedInvite = item.invites.some(
      (invite) =>
        invite.email === currentUserEmail && invite.status === "accepted"
    );

    if (
      item.visibility ||
      item.creator.email === currentUserEmail ||
      hasAcceptedInvite
    ) {
      console.log("Rendering Event:", item.id);
      return <SocialGroupsCard id={item.id} /* other props */ />;
    }
    console.log("Skipping Event:", item.id);
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Social Groups</Text>
        <FlatList
          data={filteredEvents} // Use filteredEvents
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
  // time: {
  //   fontSize: 14,
  //   marginTop: 5,
  //   color: "#888",
  // },
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
