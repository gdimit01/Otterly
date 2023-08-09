// SocialGroupsCard.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
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

const SocialGroupsCard = ({
  id,
  title,
  description,
  image,
  time,
  group,
  tag,
  visibility,
  creator,
  invites,
}) => {
  const navigation = useNavigation();
  const [UserRSVP, setUserRSVP] = useState(false);
  const [likes, setLikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const [attendees, setAttendees] = useState(0); // Define the state variable for attendees

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
    const unsubscribeRSVPs = onSnapshot(socialGroupRef, (snapshot) => {
      const data = snapshot.data();
      setAttendees(data.attendees); // Update the state with the attendee count
    });

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
            time,
            group,
            tag,
            visibility,
            creator,
            invites,
          });
        }}
      >
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.text}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.creatorName}>
            {creator.firstName} {creator.surname}
          </Text>

          <Text style={styles.description}>{description}</Text>
          <Text style={styles.time}>{time}</Text>
          <Text style={styles.group}>{group}</Text>
          <Text style={styles.tag}>#{tag}</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggleVisibility}
            style={styles.toggleButton}
          >
            <Text style={styles.toggleText}>
              {visibility ? "Make Private" : "Make Public"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.visibility}>
            {visibility ? "Public" : "Private"}
          </Text>
          <Text style={styles.invitesText}>Invites: {invites}</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.attendeesText}>Attendees: {attendees}</Text>
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
