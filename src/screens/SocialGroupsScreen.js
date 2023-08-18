import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { EventContext } from "../../src/context/EventContext";
import SocialGroupsCard from "../components/SocialGroups/SocialGroupsCard";
import { FIREBASE_AUTH as auth } from "../../firebaseConfig";

const SocialGroupsScreen = () => {
  const { events = [] } = useContext(EventContext);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = events.filter((event) => {
    return (
      event.group === "Social Group" &&
      event.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.content}>
          <Text style={styles.title}>Social Groups</Text>
          <View style={styles.searchContainer}>
            <FontAwesome
              name="search"
              size={20}
              color="gray"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for events..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <FlatList
            data={filteredEvents}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  content: {
    flex: 1,
    margin: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
  },
  searchContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    padding: 5,
  },
  text: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    marginTop: 5,
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
