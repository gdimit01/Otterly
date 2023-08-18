/**
 * The `InvitesCard` component is a React Native component that renders a card with event details and
 * handles navigation to the event screen when pressed.
 * @returns The InvitesCard component is returning a TouchableOpacity component that wraps a View
 * component. Inside the View component, there is an Image component, and a View component that
 * contains multiple Text components.
 */
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Image } from "react-native";
// Removed Animated from imports as it's no longer used
import { EventContext } from "../../context/EventContext";
import InvitesStyles from "../../../src/assets/InvitesStyles";

const InvitesCard = ({ event }) => {
  const navigation = useNavigation();

  if (!event) {
    return <Text>No event found</Text>; // Return a message if no event is found
  }

  // Destructure the event object to get the required properties
  const {
    id,
    title,
    description,
    image,
    time,
    group,
    tag,
    visibility,
    name,
    creator,
    invites,
  } = event;

  // Extract the status from the invites array
  const status = invites[0]?.status || "N/A";

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
          visibility,
        });
      }}
    >
      {/* Directly return the content that was wrapped by Swipeable */}
      <View style={InvitesStyles.invitesCard}>
        <Image source={{ uri: image }} style={InvitesStyles.invitesImage} />
        <View style={InvitesStyles.invitesTextContainer}>
          <Text style={InvitesStyles.invitesTitle}>{name}</Text>
          <Text style={InvitesStyles.invitesDescription}>
            Creator: {creator.firstName} {creator.surname}
          </Text>
          <Text style={InvitesStyles.invitesTime}>This is a time {time}</Text>
          <Text style={InvitesStyles.invitesGroup}>
            This is a group {group}
          </Text>
          <Text style={InvitesStyles.invitesTag}>Tag #{tag}</Text>
          <Text style={InvitesStyles.invitesStatus}>{status}</Text>
          <Text style={InvitesStyles.invitesVisibility}>
            {visibility ? "Public" : "Private"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default InvitesCard;
