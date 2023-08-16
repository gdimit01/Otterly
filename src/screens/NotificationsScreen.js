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
import NotificationStyles from "../assets/NotificationStyles";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import InvitesScreen from "./InvitesScreen"; // Import the InvitesScreen component
import MessagesScreen from "./MessagesScreen"; // Import the MessagesScreen component

const Tab = createMaterialTopTabNavigator();

const ActivityScreen = () => {
  const { events } = useContext(EventContext);
  const user = auth.currentUser;
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const q = query(
      collection(db, "events"),
      where("notification", "==", true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let notificationsData = [];
      snapshot.forEach((doc) => {
        const eventData = { id: doc.id, ...doc.data() };
        // Check if the current user is the creator
        if (eventData.creator && eventData.creator.email === user.email) {
          notificationsData.push(eventData);
        }
        // Check if the current user is an invitee and has accepted the invitation
        else if (
          eventData.invites &&
          eventData.invites.some(
            (invite) =>
              invite.email === user.email && invite.status === "accepted"
          )
        ) {
          notificationsData.push(eventData);
        }
      });

      setNotifications(notificationsData);
    });

    return () => unsubscribe();
  }, [user]);

  const deleteNotification = async (id) => {
    const db = getFirestore();

    try {
      const notificationDoc = await getDoc(doc(db, "notifications", id));
      const notificationData = notificationDoc.data();

      await deleteDoc(doc(db, "notifications", id));

      if (notificationData.eventId) {
        const eventDoc = await getDoc(
          doc(db, "events", notificationData.eventId)
        );

        await deleteDoc(doc(db, "events", notificationData.eventId));

        setEvents(
          (events || []).filter(
            (event) => event.id !== notificationData.eventId
          )
        );
      }

      Alert.alert("Success", "Notification and event deleted!");

      setNotifications(
        (notifications || []).filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const renderItem = ({ item }) => (
    <NotificationCard
      id={item.id}
      title={item.title}
      description={item.description}
      image={item.image}
      time={item.time}
      group={item.group}
      tag={item.tag}
      name={item.name} // Event Name
      location={item.location} // Event Location
      visibility={item.visibility} // Event Visibility
      attendees={item.attendees} // Event Attendees
      invites={item.invites} // Event Invites
      onDelete={() => deleteNotification(item.id)}
    />
  );

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

const NotificationScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <View style={NotificationStyles.content}>
        <Text style={NotificationStyles.title}>Notifications</Text>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
          tabBarIndicatorStyle: {
            borderBottomColor: "tomato",
            borderBottomWidth: 2,
          },
        }}
      >
        <Tab.Screen name="Activity" component={ActivityScreen} />
        <Tab.Screen name="Invites" component={InvitesScreen} />
        <Tab.Screen name="Messages" component={MessagesScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default NotificationScreen;
