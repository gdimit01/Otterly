import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Searchbar } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import { EventContext } from "../../src/context/EventContext";
import SocialGroupsCard from "../components/SocialGroups/SocialGroupsCard";
import { FIREBASE_AUTH as auth } from "../../firebaseConfig";

const SocialGroupsScreen = () => {
  const { events = [] } = useContext(EventContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const results = events.filter((event) => {
      return (
        event.group === "Social Group" &&
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    setFilteredEvents(results);
  }, [searchQuery, events]);

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
      return <SocialGroupsCard id={item.id} /* other props */ />;
    }
    return null;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.content}>
          <Text style={styles.title}>Social Groups</Text>
          <Searchbar
            placeholder="Search for events..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            icon={() => <FontAwesome name="search" size={20} color="grey" />}
            clearIcon={() =>
              searchQuery ? (
                <FontAwesome name="times" size={20} color="grey" />
              ) : null
            }
          />
          <FlatList
            data={filteredEvents}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 60 }}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  text: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    marginTop: 5,
  },
  content: {
    flex: 1,
    margin: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
  },
  searchBar: {
    // Custom styling for Searchbar
    marginBottom: 10,
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
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
