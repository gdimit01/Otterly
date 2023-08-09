import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/FontAwesome";
import { EventContext } from "../../context/EventContext";
import NotificationStyles from "../../../src/assets/NotificationStyles";

const InvitesCard = ({ name, creator, status }) => {
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
    <TouchableOpacity activeOpacity={0.7}>
      <Swipeable renderRightActions={renderRightActions}>
        <View style={InvitesStyles.invitesCard}>
          <View style={InvitesStyles.invitesTextContainer}>
            <Text style={InvitesStyles.invitesTitle}>{name}</Text>
            <Text style={InvitesStyles.invitesDescription}>
              C: {creator.firstName} {creator.surname}
            </Text>
            <Text style={InvitesStyles.invitesStatus}>{status}</Text>
          </View>
        </View>
      </Swipeable>
    </TouchableOpacity>
  );
};

export default InvitesCard;
