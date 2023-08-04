/**
 * The code is a JavaScript file that defines a NotificationScreen component in a React Native
 * application, which displays a list of notifications and allows the user to delete notifications by
 * swiping them.
 * @returns The code is exporting the `NotificationScreen` component as the default export.
 */
import React, { useState, useEffect, useContext } from "react";
import { EventContext, InviteContext } from "../context/EventContext";
import Icon from "react-native-vector-icons/FontAwesome";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FIREBASE_AUTH as auth } from "../../firebaseConfig";
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
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  StyleSheet,
  FlatList,
  StatusBar,
  Image,
  Alert,
  Animated,
  Button,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  RectButton,
  Swipeable,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";

const NotificationCard = ({
  id,
  title,
  description,
  image,
  time,
  group,
  tag,
  onDelete,
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
      <View style={styles.rightActionContainer}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => console.log("More pressed")}
        >
          <Animated.View
            style={[
              styles.moreAction,
              { transform: [{ translateX: translateMore }] },
            ]}
          >
            <Icon name="ellipsis-h" size={20} color="#fff" />
            <Text style={styles.actionText}>More</Text>
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => console.log("Flag pressed")}
        >
          <Animated.View
            style={[
              styles.flagAction,
              { transform: [{ translateX: translateFlag }] },
            ]}
          >
            <Icon name="flag" size={20} color="#fff" />
            <Text style={styles.actionText}>Flag</Text>
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.6} onPress={onDelete}>
          <Animated.View
            style={[
              styles.deleteAction,
              { transform: [{ translateX: translateDelete }] },
            ]}
          >
            <Icon name="trash" size={20} color="#fff" />
            <Text style={styles.actionText}>Delete</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  // Extract event name from the title
  const eventName = title.replace("New Event Created: ", "");

  // Wrap the NotificationCard with TouchableOpacity
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        // Navigate to the EventScreen with the relevant information
        navigation.navigate("EventScreen", {
          id,
          title: eventName,
          description,
          image,
          time,
          group,
          tag,
        });
      }}
    >
      <Swipeable renderRightActions={renderRightActions}>
        <View style={styles.notificationCard}>
          <Image source={{ uri: image }} style={styles.notificationImage} />
          <View style={styles.notificationTextContainer}>
            <Text style={styles.notificationTitle}>{eventName}</Text>
            <Text style={styles.notificationDescription}>{description}</Text>
            <Text style={styles.notificationTime}>{time}</Text>
            <Text style={styles.notificationGroup}>{group}</Text>
            <Text style={styles.notificationTag}>#{tag}</Text>
          </View>
        </View>
      </Swipeable>
    </TouchableOpacity>
  );
};

const NotificationScreen = () => {
  const isFocused = useIsFocused();
  const [notifications, setNotifications] = useState([]);
  const [events, setEvents] = useContext(EventContext);

  useEffect(() => {
    if (isFocused) {
      const db = getFirestore();
      const user = auth.currentUser;
      if (user) {
        const q = query(
          collection(db, "notifications"),
          where("userId", "==", user.uid)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
          let notificationsData = [];
          snapshot.forEach((doc) => {
            notificationsData.push({ id: doc.id, ...doc.data() });
          });
          setNotifications(notificationsData);
        });

        return () => unsubscribe();
      }
    }
  }, [isFocused]);

  const deleteNotification = async (id) => {
    const db = getFirestore();

    try {
      await deleteDoc(doc(db, "notifications", id));
      setNotifications(
        (notifications || []).filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const deleteAllNotifications = async () => {
    const db = getFirestore();

    try {
      notifications.forEach(async (notification) => {
        await deleteDoc(doc(db, "notifications", notification.id));
      });
      setNotifications([]);
      Alert.alert("Success", "All notifications deleted!");
    } catch (error) {
      console.error("Error deleting documents: ", error);
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
      onDelete={() => deleteNotification(item.id)}
    />
  );

  const renderHeaderRight = () => (
    <View style={{ marginRight: 10 }}>
      <Button
        onPress={() => console.log("Edit button pressed")}
        title="Edit"
        color="#000"
      />
    </View>
  );

  const renderHeaderLeft = () => (
    <View style={{ marginLeft: 10 }}>
      <Button
        onPress={() =>
          Alert.alert("Delete All", "Are you sure you want to delete all?", [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: "OK",
              onPress: deleteAllNotifications,
            },
          ])
        }
        title="Delete All"
        color="#000"
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Notifications</Text>
          {renderHeaderRight()}
          {renderHeaderLeft()}
        </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  }, //important as this holds the card in place
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  notificationDescription: {
    fontSize: 16,
    marginTop: 5,
  },
  notificationTime: {
    fontSize: 14,
    marginTop: 5,
    color: "#888",
  },
  radioButton: {
    marginRight: 10,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editButton: {
    fontSize: 18,
    color: "blue",
  },
  deleteButton: {
    fontSize: 18,
    color: "red",
    textAlign: "right",
  },
  rightActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
    height: "100%",
    justifyContent: "flex-end",
  },
  moreAction: {
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
    borderRadius: 10,
  },
  flagAction: {
    backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
    borderRadius: 10,
  },
  deleteAction: {
    backgroundColor: "#dd2c00",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
    borderRadius: 10,
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    padding: 10,
  },
  notificationGroup: {
    color: "#0000FF", // Default blue color
    fontSize: 12,
    fontWeight: "bold",
    position: "absolute", // Position it absolutely
    top: -10, // 10 pixels from the top of the container
    right: -15, // 10 pixels from the right of the container
  },
  notificationTag: {
    color: "#0000FF", // Default blue color
    fontSize: 12,
    fontWeight: "bold",
    position: "absolute", // Position it absolutely
    bottom: -10, // 10 pixels from the bottom of the container
    right: -15, // 10 pixels from the right of the container
  },
});

export default NotificationScreen;
