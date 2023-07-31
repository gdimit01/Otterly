import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { EventContext } from "../screens/EventContext";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "@firebase/firestore";
import SearchBarComponent from "../components/SearchBarComponent";

const SocialGroupsScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useContext(EventContext);
  const [searchQuery, setSearchQuery] = useState(""); // Add this

  useEffect(() => {
    setLoading(true);
    const db = getFirestore();
    const fetchEvents = async () => {
      try {
        const q = query(
          collection(db, "events"),
          where("group", "==", "Social Group")
        );
        const querySnapshot = await getDocs(q);
        let eventsData = [];
        querySnapshot.forEach((doc) => {
          eventsData.push({ id: doc.id, ...doc.data() });
        });
        setEvents(eventsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on searchQuery
  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEventPress = (event) => {
    navigation.navigate("EventScreen", {
      image: event.image,
      title: event.name,
      description: event.description,
      time: event.time,
      location: event.location,
      tag: event.tag,
      group: event.group,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Social Groups</Text>
      <SearchBarComponent
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <FlatList
        data={filteredEvents}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEventPress(item)}>
            <View style={styles.card}>
              <Image
                style={styles.image}
                source={{ uri: "https://via.placeholder.com/150" }}
              />
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.location}>{item.location}</Text>
              <Text style={styles.group}>Group: {item.group}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
  group: {
    fontSize: 16,
    color: "blue",
    marginTop: 5,
  },
});

export default SocialGroupsScreen;
