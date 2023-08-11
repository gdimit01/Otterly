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

const SocialGroupsCard = ({
  id,
  showButtons = true,
  showDetailsOnly = false,
}) => {
  const navigation = useNavigation();
  const { events } = useContext(EventContext); // Use EventContext
  const event = events.find((e) => e.id === id); // Find the event by ID

  // Declare state variables here
  const [likes, setLikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [attendees, setAttendees] = useState(0);

  // Use event properties directly from the event object
  if (!event) {
    console.error("Event not found for ID:", id);
    return null;
  }
  const {
    title,
    description,
    image,
    // Format the time using moment.js if needed
    // Directly access the time from the event object
    time = moment(event.time, "DD/MM/YYYY, HH:mm:ss ZZ").format(
      "MMMM Do YYYY, h:mm:ss a"
    ),

    group,
    tag,
    visibility,
    creator,
    invites,
  } = event;

  useEffect(() => {
    const db = getFirestore();
    const likesRef = collection(db, "events", id, "likes");
    const socialGroupRef = doc(db, "events", id); // Reference to the event document

    const unsubscribeLikes = onSnapshot(likesRef, (snapshot) => {
      setLikes(snapshot.size);
      setUserLiked(
        snapshot.docs
          .map((doc) => doc.data().email)
          .includes(auth.currentUser.email) // Use email instead of UID
      );
    });

    // Listen to changes in the event document to get the attendee count
    const unsubscribeRSVPs = onSnapshot(
      collection(db, "events", id, "attendees"),
      (snapshot) => {
        setAttendees(snapshot.docs.map((doc) => doc.data())); // Update the state with the attendee objects
      }
    );

    return () => {
      unsubscribeLikes();
      unsubscribeRSVPs();
    };
  }, [id]);

  const deleteSocialGroup = async () => {
    const db = getFirestore();
    await deleteDoc(doc(db, "events", id));
  };

  const handleLikes = async () => {
    const db = getFirestore();
    const socialGroupRef = doc(db, "events", id);
    const socialGroupSnapshot = await getDoc(socialGroupRef);
    const currentUser = auth.currentUser;

    if (socialGroupSnapshot.exists() && currentUser) {
      const data = socialGroupSnapshot.data();

      if (data.creator.email === currentUser.email) {
        Alert.alert("Error", "You can't like your own post.");
        return;
      }

      const likesRef = collection(db, "events", id, "likes");
      const userLikeSnapshot = await getDoc(doc(likesRef, currentUser.email)); // Use email instead of UID

      if (!userLikeSnapshot.exists()) {
        await setDoc(doc(likesRef, currentUser.email), {
          email: currentUser.email,
        }); // Use email instead of UID
        await updateDoc(socialGroupRef, {
          likes: (data.likes || 0) + 1, // Increment likes
        });
        setUserLiked(true);
      } else {
        await deleteDoc(doc(likesRef, currentUser.email)); // Use email instead of UID
        await updateDoc(socialGroupRef, {
          likes: (data.likes || 0) - 1, // Decrement likes
        });
        setUserLiked(false);
      }
    }
  };

  // In your RSVP function
  const handleRSVP = async () => {
    const db = getFirestore();
    const socialGroupRef = doc(db, "events", id);
    const currentUser = auth.currentUser;
    if (currentUser) {
      const rsvpRef = collection(db, "events", id, "rsvps");
      const userRsvpSnapshot = await getDoc(doc(rsvpRef, currentUser.email));
      const socialGroupSnapshot = await getDoc(socialGroupRef);
      if (socialGroupSnapshot.exists()) {
        const data = socialGroupSnapshot.data();
        if (!userRsvpSnapshot.exists()) {
          await setDoc(doc(rsvpRef, currentUser.email), {
            email: currentUser.email,
          });
          await updateDoc(socialGroupRef, {
            attendees: (data.attendees || 0) + 1, // Increment attendees
          });
        } else {
          await deleteDoc(doc(rsvpRef, currentUser.email));
          await updateDoc(socialGroupRef, {
            attendees: (data.attendees || 0) - 1, // Decrement attendees
          });
        }
      } else {
        console.error("Social group does not exist:", id);
      }
    }
  };

  const toggleVisibility = async () => {
    const db = getFirestore();
    const socialGroupRef = doc(db, "events", id);
    const socialGroupSnapshot = await getDoc(socialGroupRef);
    const currentUser = auth.currentUser;

    if (socialGroupSnapshot.exists() && currentUser) {
      const data = socialGroupSnapshot.data();
      if (data.creator.email === currentUser.email) {
        // Compare emails instead of UIDs
        const newVisibility = !data.visibility;
        await updateDoc(socialGroupRef, { visibility: newVisibility });
      } else {
        Alert.alert(
          "Error",
          "Only the creator can change the event visibility."
        );
      }
    }
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          navigation.navigate("EventScreen", {
            id,
            title,
            description,
            image,
            time: moment(event.time, "DD/MM/YYYY, HH:mm:ss ZZ").format(
              "MMMM Do YYYY, h:mm:ss a"
            ),
            group,
            tag,
            visibility,
            creator,
            invites,
          });
        }}
      >
        <Image source={{ uri: image }} style={styles.image} />
        {showDetailsOnly && (
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.creatorName}>
              Created by:
              {creator.firstName} {creator.surname} ({creator.email})
            </Text>
            <Text style={styles.description}>Description: {description}</Text>
            <Text style={styles.group}>{group}</Text>
            <Text style={styles.invitesText}>
              Invite Email: {invites.email} - Status: {invites.status}
            </Text>
            <Text style={styles.attendeesText}>
              Attendees: {attendees.length}
            </Text>
            <Text style={styles.visibility}>
              {visibility ? "Public" : "Private"}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      {showButtons && (
        <>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggleVisibility}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleText}>
              {visibility ? "Make Private" : "Make Public"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleRSVP}
            style={styles.rsvpButton}
          >
            <Text style={styles.rsvpText}>RSVP</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleLikes}
            style={styles.likeButton}
          >
            <Text style={styles.likeText}>Like {likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={deleteSocialGroup}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  creatorName: {
    fontSize: 16,
    color: "gray",
  },
  toggleButton: {
    backgroundColor: "#FFD700", // Yellow color
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  toggleText: {
    color: "#ffffff",
    textAlign: "center",
  },
  rsvpButton: {
    backgroundColor: "#27ae60",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  rsvpText: {
    color: "#ffffff",
    textAlign: "center",
  },

  likeButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  likeText: {
    color: "#ffffff",
    textAlign: "center",
  },

  image: {
    width: "100%",
    height: 150,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  location: {
    fontSize: 16,
    color: "gray",
    marginTop: 5,
  },
  deleteAction: {
    backgroundColor: "#dd2c00",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
    flexDirection: "row",
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
  },
  text: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    marginTop: 5,
  },
  time: {
    fontSize: 14,
    marginTop: 5,
    color: "#888",
  },
  group: {
    color: "#0000FF", // Default blue color
    fontSize: 12,
    fontWeight: "bold",
    position: "absolute", // Position it absolutely
  },
  tag: {
    color: "#0000FF", // Default blue color
    fontSize: 12,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#ff0000",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  deleteText: {
    color: "#ffffff",
    textAlign: "center",
  },
});

export default SocialGroupsCard;
