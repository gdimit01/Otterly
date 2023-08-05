import React, { useState, useEffect, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StatusBar,
  Alert,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { EventContext } from "../context/EventContext";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc,
  query,
  where,
} from "@firebase/firestore";
import { FIREBASE_AUTH as auth } from "../../firebaseConfig";
import NotificationCard from "../components/NotificationGroup/NotificationCard";
import NotificationStyles from "../../src/assets/NotificationStyles";

const ActivityScreen = () => {
  const isFocused = useIsFocused();
  const [notifications, setNotifications] = useState([]);
  const [events, setEvents] = useContext(EventContext);

  // ... rest of your code ...

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <View style={NotificationStyles.content}>
        <Text style={NotificationStyles.title}>Notifications</Text>
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ActivityScreen;
