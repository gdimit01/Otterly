import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Image, Animated } from "react-native";
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

  const renderRightActions = (progress, dragX) => {
    const translateMore = dragX.interpolate({
      inputRange: [-200, 0],
      outputRange: [0, 200],
      extrapolate: "clamp",
    });
    const translateFlag = dragX.interpolate({
      inputRange: [-150, -50],
      outputRange: [0, 150],
      extrapolate: "clamp",
    });
    const translateDelete = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: "clamp",
    });

    return (
      <View style={NotificationStyles.rightActionContainer}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => console.log("More pressed")}
        >
          <Animated.View
            style={[
              NotificationStyles.moreAction,
              { transform: [{ translateX: translateMore }] },
            ]}
          >
            <Icon name="ellipsis-h" size={20} color="#fff" />
            <Text style={NotificationStyles.actionText}>More</Text>
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => console.log("Flag pressed")}
        >
          <Animated.View
            style={[
              NotificationStyles.flagAction,
              { transform: [{ translateX: translateFlag }] },
            ]}
          >
            <Icon name="flag" size={20} color="#fff" />
            <Text style={NotificationStyles.actionText}>Flag</Text>
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6} onPress={onDelete}>
          <Animated.View
            style={[
              NotificationStyles.deleteAction,
              { transform: [{ translateX: translateDelete }] },
            ]}
          >
            <Icon name="trash" size={20} color="#fff" />
            <Text style={NotificationStyles.actionText}>Delete</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

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
      <Swipeable renderRightActions={renderRightActions}>
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
            <Text style={NotificationStyles.notificationTime}>
              Time: {time}
            </Text>
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
      </Swipeable>
    </TouchableOpacity>
  );
};

export default NotificationCard;
