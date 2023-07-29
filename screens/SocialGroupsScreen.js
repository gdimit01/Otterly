import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from "react-native";

export default function SocialGroupsScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Study Groups</Text>
      <FlatList
        data={DATA}
        renderItem={({ item }) => (
          <Card name={item.name} location={item.location} image={item.image} />
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

const Card = ({ name, location, image }) => (
  <View style={styles.card}>
    <Image style={styles.image} source={{ uri: image }} />
    <Text style={styles.name}>{name}</Text>
    <Text style={styles.location}>{location}</Text>
  </View>
);

const DATA = [
  {
    id: "1",
    name: "React Native Austin",
    location: "Austin, USA",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    name: "React Native Bangalore",
    location: "Bangalore, India",
    image: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    name: "React Native Montevideo",
    location: "Montevideo, Uruguay",
    image: "https://via.placeholder.com/150",
  },
  // Add more groups here...
];

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

//export default SocialGroupsScreen;
