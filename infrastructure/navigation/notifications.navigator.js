/* This code is defining a screen component called `NotificationScreen` that displays a tab navigation
bar with three tabs: "Activity", "Invites", and "Messages". Each tab corresponds to a different
screen component (`ActivityScreen`, `InvitesScreen`, and `MessagesScreen`). The `NotificationScreen`
component also includes some imports from various libraries and files, such as React, React Native,
and Firebase. It also uses some styling and layout components from React Native, such as
`SafeAreaView`, `View`, `Text`, and `StatusBar`. */
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

const Tab = createMaterialTopTabNavigator();

export const NotificationScreen = () => {
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
