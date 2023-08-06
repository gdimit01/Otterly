import React from "react";
import { SafeAreaView, StatusBar, View, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import NotificationStyles from "../assets/NotificationStyles";
import ActivityScreen from "./ActivityScreen";
import InvitesScreen from "./InvitesScreen";
import MessagesScreen from "./MessagesScreen";

const Tab = createMaterialTopTabNavigator();

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
