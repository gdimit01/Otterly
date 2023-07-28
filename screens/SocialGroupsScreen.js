import React, { useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from "react-native";

import SearchBarComponent from "../components/SearchBarComponent";
import { EventContext } from "../screens/EventContext"; // Import EventContext

const SocialGroupsScreen = () => {
  const { events } = useContext(EventContext); // Use EventContext

  // Check if events is defined before calling filter
  const socialGroupEvents = events
    ? events.filter((event) => event.group === "SocialGroup")
    : [];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Social Groups</Text>
      <SearchBarComponent />
      <FlatList
        data={socialGroupEvents} // Use socialGroupEvents instead of DATA
        renderItem={({ item }) => (
          <Card name={item.name} location={item.location} image={item.image} />
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const Card = ({ name, location, image }) => (
  <View style={styles.card}>
    <Image style={styles.image} source={{ uri: image }} />
    <Text style={styles.name}>{name}</Text>
    <Text style={styles.location}>{location}</Text>
  </View>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: 150,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  location: {
    fontSize: 16,
    color: "gray",
    marginTop: 5,
  },
});

export default SocialGroupsScreen;
