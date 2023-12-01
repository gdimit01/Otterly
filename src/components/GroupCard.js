import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { EventContext } from "../../../src/context/EventContext";
import { List } from "react-native-paper";
import { FontAwesome } from "@expo/vector-icons";
import {
  deleteDoc,
  getDoc,
  setDoc,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "@firebase/firestore";
import { FIREBASE_AUTH as auth } from "../../../firebaseConfig";
import moment from "moment";

const GroupCard = ({
  id,
  showButtons = true,
  showDetailsOnly = true,
  showOptions = true,
}) => {
  const navigation = useNavigation();
  const { events } = useContext(EventContext);
  const event = events.find((e) => e.id === id);

  const [likes, setLikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [attendees, setAttendees] = useState(0);
  const [optionsVisible, setOptionsVisible] = useState(false);

  if (!event) {
    console.error("Event not found for ID:", id);
    return null;
  }

  const {
    title,
    description,
    image,
    time,
    group,
    tag,
    visibility,
    creator,
    invites,
  } = event;

  useEffect(() => {
    const db = getFirestore();
    const likesRef = collection(db, "events", id, "likes");
    const attendeesRef = collection(db, "events", id, "attendees");

    const unsubscribeLikes = onSnapshot(likesRef, (snapshot) => {
      setLikes(snapshot.size);
      setUserLiked(
        snapshot.docs.some((doc) => doc.id === auth.currentUser?.uid)
      );
    });

    const unsubscribeAttendees = onSnapshot(attendeesRef, (snapshot) => {
      setAttendees(snapshot.size);
    });

    return () => {
      unsubscribeLikes();
      unsubscribeAttendees();
    };
  }, [id, auth.currentUser]);

  const handleLikes = async () => {
    const db = getFirestore();
    const eventRef = doc(db, "events", id);
    const likesRef = collection(db, "events", id, "likes");
    const userLikeRef = doc(likesRef, auth.currentUser?.email);

    try {
      const userLikeSnapshot = await getDoc(userLikeRef);
      if (!userLikeSnapshot.exists()) {
        await setDoc(userLikeRef, { email: auth.currentUser?.email });
        await updateDoc(eventRef, { likes: (likes || 0) + 1 });
        setLikes(likes + 1);
        setUserLiked(true);
      } else {
        await deleteDoc(userLikeRef);
        await updateDoc(eventRef, { likes: (likes || 0) - 1 });
        setLikes(likes - 1);
        setUserLiked(false);
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  const handleRSVP = async () => {
    const db = getFirestore();
    const eventRef = doc(db, "events", id);
    const rsvpRef = collection(db, "events", id, "RSVP");
    const userRsvpRef = doc(rsvpRef, auth.currentUser?.email);

    try {
      const userRsvpSnapshot = await getDoc(userRsvpRef);
      if (!userRsvpSnapshot.exists()) {
        await setDoc(userRsvpRef, { email: auth.currentUser?.email });
        await updateDoc(eventRef, { attendees: (attendees || 0) + 1 });
        setAttendees(attendees + 1);
      } else {
        await deleteDoc(userRsvpRef);
        await updateDoc(eventRef, { attendees: (attendees || 0) - 1 });
        setAttendees(attendees - 1);
      }
    } catch (error) {
      console.error("Error updating RSVP:", error);
    }
  };

  const handleDelete = async () => {
    const db = getFirestore();
    const eventRef = doc(db, "events", id);

    try {
      await deleteDoc(eventRef);
      Alert.alert("Success", "Event deleted successfully.");
      // Additional code to update the UI or navigate the user
    } catch (error) {
      Alert.alert("Error", "Failed to delete the event.");
      console.error("Error deleting document:", error);
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() => navigation.navigate("EventDetails", { id })}
        style={styles.touchable}
      >
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.title}>{title}</Text>
          <Text>{description}</Text>
          <Text>{moment(time).format("MMMM Do YYYY, h:mm:ss a")}</Text>
        </View>
      </TouchableOpacity>
      {showOptions && (
        <List.Accordion
          title={optionsVisible ? "Hide Options" : "Show Options"}
          expanded={optionsVisible}
          onPress={() => setOptionsVisible(!optionsVisible)}
          style={styles.accordion}
        >
          {showButtons && (
            <>
              <TouchableOpacity onPress={handleLikes} style={styles.likeButton}>
                <FontAwesome
                  name="thumbs-up"
                  size={20}
                  color={userLiked ? "blue" : "black"}
                />
                <Text>{likes} Likes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleRSVP} style={styles.rsvpButton}>
                <FontAwesome name="calendar" size={20} />
                <Text>RSVP</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDelete}
                style={styles.deleteButton}
              >
                <FontAwesome name="trash" size={20} color="red" />
                <Text>Delete Event</Text>
              </TouchableOpacity>
            </>
          )}
        </List.Accordion>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  touchable: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 10,
  },
  details: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  accordion: {
    marginHorizontal: 10,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  rsvpButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
});

export default GroupCard;
