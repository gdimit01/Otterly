import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  FlatList,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment"; // Import moment.js

const EventScreen = ({ route }) => {
  const navigation = useNavigation();

  // Data from the NotificationCard
  const event = route.params;

  // Retrieve the selected tag and group from the navigation parameters
  const { tag, group } = event;

  //added uri
  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: StatusBar.currentHeight }]}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Event</Text>
        <Image
          source={{ uri: "https://via.placeholder.com/150" }}
          style={styles.mainImage}
        />
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.description}>{event.description}</Text>
        <Text style={styles.time}>
          {moment(event.time, "DD/MM/YYYY, HH:mm:ss Z").format(
            "MMMM Do YYYY, h:mm a"
          )}
        </Text>

        <Text style={styles.location}>{event.location}</Text>

        {/* Display the tag and group */}
        <Text style={styles.tag}>Tag: {tag}</Text>
        <Text style={styles.group}>Group: {group}</Text>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  mainImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  time: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  tag: {
    fontSize: 14,
    marginBottom: 10,
  },
  group: {
    fontSize: 14,
    marginBottom: 10,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    paddingBottom: 25,
  },
  backButtonText: {
    fontSize: 16,
    color: "blue",
  },
});

export default EventScreen;
