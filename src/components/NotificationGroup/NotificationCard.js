import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Image } from "react-native";
// Removed Animated from imports as it's no longer used
import { Swipeable } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import { EventContext } from "../../context/EventContext";
import NotificationStyles from "../../../src/assets/NotificationStyles";

const NotificationCard = ({ id, onDelete }) => {
  const navigation = useNavigation();
  const { events } = useContext(EventContext);

  // Find the specific event by its id
  const event = events.find((e) => e.id === id);

  // Destructure the event properties
  const {
    title,
    description,
    image,
    time,
    group,
    tag,
    name,
    location,
    visibility,
    attendees,
    invites,
  } = event || {};

  // Check if title is defined before calling replace
  const eventName = title ? title.replace("Event Name: ", "") : "";

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        navigation.navigate("EventScreen", {
          id,
          title,
          description,
          image,
          time,
          group,
          tag,
        });
      }}
    >
      <View style={NotificationStyles.notificationCard}>
        <Image
          source={{ uri: image }}
          style={NotificationStyles.notificationImage}
        />
        <View style={NotificationStyles.notificationTextContainer}>
          <Text
            style={NotificationStyles.notificationTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          <Text
            style={NotificationStyles.notificationDescription}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            Event Name: {name}
          </Text>
          <Text
            style={NotificationStyles.notificationDescription}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            Event Description: {description}
          </Text>
          <Text style={NotificationStyles.notificationTime}>Time: {time}</Text>
          <Text style={NotificationStyles.location}>
            Event Location: {location}
          </Text>
          <Text style={NotificationStyles.visibility}>
            Visibility: {visibility ? "Public" : "Private"}
          </Text>
          <Text style={NotificationStyles.attendees}>
            Attendees: {Array.isArray(attendees) ? attendees.join(", ") : ""}
          </Text>
          <Text style={NotificationStyles.invites}>
            Invites:{" "}
            {Array.isArray(invites)
              ? invites.map((invitee) => invitee.email).join(", ")
              : ""}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationCard;
