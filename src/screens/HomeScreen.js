import React from "react";
import {
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
  View,
  StatusBar,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/core";
import { useAuth } from "../../src/hooks/useAuth";
import styles from "../../src/assets/HomeScreen.styles";
import { ActivityItem } from "../../src/components/ActivityItem";

export const HomeScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { user, firstName, surname, handleSignOut } = useAuth();

  const activities = [
    { id: "1", title: "Activity 1", image: "https://via.placeholder.com/150" },
    { id: "2", title: "Activity 2", image: "https://via.placeholder.com/150" },
    { id: "3", title: "Activity 3", image: "https://via.placeholder.com/150" },
    { id: "4", title: "Activity 4", image: "https://via.placeholder.com/150" },
    { id: "5", title: "Activity 5", image: "https://via.placeholder.com/150" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Home</Text>
      <ScrollView contentContainerStyle={styles.container}>
        {user ? (
          <View style={styles.userInfoContainer}>
            <Text style={styles.greetingText}>
              Hi {firstName} {surname}
            </Text>
            <Text>Email: {user.email}</Text>
          </View>
        ) : (
          <Text>No user is signed in.</Text>
        )}
        <View style={styles.card}>
          <Text style={styles.cardText}>Explore more upcoming events</Text>
        </View>
        <View style={styles.activitiesContainer}>
          <FlatList
            horizontal
            data={activities}
            renderItem={({ item }) => <ActivityItem item={item} />}
            keyExtractor={(item) => item.id}
          />
        </View>
        <View style={styles.calendarCard}>
          <Text style={styles.cardText}>Calendar</Text>
          <Image
            source={{ uri: "https://via.placeholder.com/300" }}
            style={styles.calendarImage}
          />
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.button}>
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
