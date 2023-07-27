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
import { useIsFocused } from "@react-navigation/native";
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
import { RectButton, Swipeable } from "react-native-gesture-handler";

// ... rest of your code

const NotificationCard = ({
  id,
  title,
  description,
  image,
  time,
  onDelete,
}) => {
  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    return (
      <View style={styles.rightActionContainer}>
        <RectButton style={styles.moreAction}>
          <Text style={styles.actionText}>More</Text>
        </RectButton>
        <RectButton style={styles.flagAction}>
          <Text style={styles.actionText}>Flag</Text>
        </RectButton>
        <RectButton style={styles.deleteAction} onPress={onDelete}>
          <Animated.Text
            style={[
              styles.actionText,
              {
                transform: [{ scale }],
              },
            ]}
          >
            Delete
          </Animated.Text>
        </RectButton>
      </View>
    );
  };

  return (
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
  },
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
    justifyContent: "flex-end",
  },
  moreAction: {
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
  },
  flagAction: {
    backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
  },
  deleteAction: {
    backgroundColor: "#dd2c00",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    padding: 10,
  },
});

export default NotificationScreen;
