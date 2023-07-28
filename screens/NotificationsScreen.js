import Icon from "react-native-vector-icons/FontAwesome";
import { FIREBASE_AUTH as auth } from "../firebaseConfig"; // Import auth from Firebase
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
import React, { useState, useEffect } from "react";
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
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  RectButton,
  Swipeable,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";

// ... rest of your code

const NotificationCard = ({
  id,
  title,
  description,
  image,
  time,
  onDelete,
}) => {
  const navigation = useNavigation(); // Initialize navigation

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

  // Wrap the NotificationCard with TouchableOpacity
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        // Navigate to the EventScreen with the relevant information
        navigation.navigate("EventScreen", {
          id,
          title,
          description,
          image,
          time,
        });
      }}
    >
      <Swipeable renderRightActions={renderRightActions}>
        <View style={styles.notificationCard}>
          <Image source={{ uri: image }} style={styles.notificationImage} />
          <View style={styles.notificationTextContainer}>
            <Text style={styles.notificationTitle}>{title}</Text>
            <Text style={styles.notificationDescription}>{description}</Text>
            <Text style={styles.notificationTime}>{time}</Text>
          </View>
        </View>
      </Swipeable>
    </TouchableOpacity>
  );
};

const NotificationScreen = () => {
  const isFocused = useIsFocused();
  const [notifications, setNotifications] = useState([]);

  // In NotificationScreen.js

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

        // Cleanup subscription on unmount
        return () => unsubscribe();
      }
    }
  }, [isFocused]);

  const deleteNotification = async (id) => {
    const db = getFirestore();
    try {
      // Fetch the notification
      const notificationDoc = await getDoc(doc(db, "notifications", id));
      const notificationData = notificationDoc.data();

      console.log("Notification data:", notificationData); // Log the notification data

      // Delete the notification
      await deleteDoc(doc(db, "notifications", id));

      // Delete the corresponding event using the event ID stored in the notification data
      if (notificationData.eventId) {
        const eventDoc = await getDoc(
          doc(db, "events", notificationData.eventId)
        ); // Fetch the event
        console.log("Event data:", eventDoc.data()); // Log the event data

        await deleteDoc(doc(db, "events", notificationData.eventId));
      }

      Alert.alert("Success", "Notification and event deleted!");

      // Remove the deleted notification from the state
      setNotifications(
        notifications.filter((notification) => notification.id !== id)
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
      onDelete={() => deleteNotification(item.id)}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Notifications</Text>
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
});

export default NotificationScreen;
