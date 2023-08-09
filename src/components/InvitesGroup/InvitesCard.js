import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Image, Animated } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import { EventContext } from "../../context/EventContext";
import NotificationStyles from "../../../src/assets/NotificationStyles";

const InvitesCard = ({
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
  status,
}) => {
  const navigation = useNavigation();
  const [events, setEvents] = useContext(EventContext);

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
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => console.log("Delete pressed")}
        >
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

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        navigation.navigate("EventScreen", {
          id,
          title: name,
          description,
          image,
          time,
          group,
          tag,
          visibility,
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
            <Text style={NotificationStyles.notificationTitle}>{name}</Text>
            <Text style={NotificationStyles.notificationDescription}>
              Creator: {creator.firstName} {creator.surname}
            </Text>
            <Text style={NotificationStyles.notificationTime}>{time}</Text>
            <Text style={NotificationStyles.notificationGroup}>{group}</Text>
            <Text style={NotificationStyles.notificationTag}>#{tag}</Text>
            <Text style={NotificationStyles.notificationTag}>
              {visibility ? "Public" : "Private"}
            </Text>
            <Text style={NotificationStyles.notificationTag}>{status}</Text>
          </View>
        </View>
      </Swipeable>
    </TouchableOpacity>
  );
};

export default InvitesCard;
