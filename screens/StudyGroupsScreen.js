import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import SearchBarComponent from "../components/SearchBarComponent";
import { EventContext } from "../screens/EventContext"; // Import EventContext

// Custom hook for fetching and filtering events
const useStudyGroupEvents = () => {
  const { events } = useContext(EventContext); // Use EventContext
  const [studyGroupEvents, setStudyGroupEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      // Check if events is defined before calling filter
      const filteredEvents = events
        ? events.filter((event) => event.group === "StudyGroup")
        : [];

      setStudyGroupEvents(filteredEvents);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [events]);

  return { studyGroupEvents, loading, error };
};

const StudyGroupsScreen = () => {
  const navigation = useNavigation();
  const { studyGroupEvents, loading, error } = useStudyGroupEvents();

  const handleEventPress = (event) => {
    navigation.navigate("EventScreen", event);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Study Groups</Text>
      <SearchBarComponent />
      <FlatList
        data={studyGroupEvents} // Use studyGroupEvents instead of DATA
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEventPress(item)}>
            <Card
              name={item.name}
              location={item.location}
              image={item.image}
            />
          </TouchableOpacity>
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

export default StudyGroupsScreen;
