import React, { useState, useEffect } from "react";
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
  Platform,
} from "react-native";

const DATA = [
  {
    id: "1",
    name: "Study Groups",
    image: "https://loremflickr.com/150/150?random=50",
  },
  {
    id: "2",
    name: "Social Groups",
    image: "https://loremflickr.com/150/150?random=9000",
  },
  // Add more groups here...
];

const Card = ({ name, location, image, navigation }) => {
  const handlePress = () => {
    if (name === "Study Groups") {
      navigation.navigate("StudyGroups");
    } else if (name === "Social Groups") {
      navigation.navigate("SocialGroups");
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.card}
      onPress={handlePress}
    >
      <Image style={styles.image} source={{ uri: image }} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.location}>{location}</Text>
    </TouchableOpacity>
  );
};

const ExploreScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 10); // Simulate a loading time of 1000 milliseconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Explore Groups</Text>
      <FlatList
        data={DATA}
        renderItem={({ item }) => (
          <Card
            name={item.name}
            location={item.location}
            image={item.image}
            navigation={navigation}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});

export default ExploreScreen;
