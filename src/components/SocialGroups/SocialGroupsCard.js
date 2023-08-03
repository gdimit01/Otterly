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
  getDocs,
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
}) => {
  const [UserRSVP, setUserRSVP] = useState(false);
  const [likes, setLikes] = useState(0);
  const [userLiked, setUserLiked] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const db = getFirestore();
    const likesRef = collection(db, "socialgroups", id, "likes");
    const unsubscribeLikes = onSnapshot(likesRef, (snapshot) => {
      setLikes(snapshot.size);
      setUserLiked(
        snapshot.docs.map((doc) => doc.id).includes(auth.currentUser.uid)
      );
    });

    const rsvpRef = collection(db, "socialgroups", id, "rsvps");
    const currentUser = auth.currentUser;
    if (currentUser) {
      const unsubscribeRSVP = onSnapshot(
        doc(rsvpRef, currentUser.uid),
        (snapshot) => {
          setUserRSVP(snapshot.exists());
        }
      );

      return () => {
        unsubscribeLikes();
        unsubscribeRSVP();
      };
    }

    return () => {
      unsubscribeLikes();
    };
  }, [id]);

  const deleteSocialGroup = async () => {
    const db = getFirestore();
    await deleteDoc(doc(db, "socialgroups", id));
  };

  const handleLikes = async () => {
    const db = getFirestore();
    const socialGroupRef = doc(db, "socialgroups", id);
    const socialGroupSnapshot = await getDoc(socialGroupRef);
    const currentUser = auth.currentUser;

    if (socialGroupSnapshot.exists() && currentUser) {
      const data = socialGroupSnapshot.data();

      if (data.creator.uid === currentUser.uid) {
        Alert.alert("Error", "You can't like your own post.");
        return;
      }

      const likesRef = collection(db, "socialgroups", id, "likes");
      const userLikeSnapshot = await getDoc(doc(likesRef, currentUser.uid));

      if (!userLikeSnapshot.exists()) {
        await setDoc(doc(likesRef, currentUser.uid), { uid: currentUser.uid });
        setUserLiked(true);
      } else {
        await deleteDoc(doc(likesRef, currentUser.uid));
        setUserLiked(false);
      }
    }
  };

  const handleRSVP = async () => {
    const db = getFirestore();
    const socialGroupRef = doc(db, "socialgroups", id);
    const currentUser = auth.currentUser;

    if (currentUser) {
      const rsvpRef = collection(db, "socialgroups", id, "rsvps");
      const userRsvpSnapshot = await getDoc(doc(rsvpRef, currentUser.uid));

      if (!userRsvpSnapshot.exists()) {
        await setDoc(doc(rsvpRef, currentUser.uid), { uid: currentUser.uid });
      } else {
        await deleteDoc(doc(rsvpRef, currentUser.uid));
      }
    }
  };

  const toggleVisibility = async () => {
    const db = getFirestore();
    const socialGroupRef = doc(db, "socialgroups", id);
    const socialGroupSnapshot = await getDoc(socialGroupRef);
    const currentUser = auth.currentUser;

    if (socialGroupSnapshot.exists() && currentUser) {
      const data = socialGroupSnapshot.data();
      if (data.creator.uid === currentUser.uid) {
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
          });
        }}
      >
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.text}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.time}>{time}</Text>
          <Text style={styles.group}>{group}</Text>
          <Text style={styles.tag}>#{tag}</Text>
          <Text style={styles.visibility}>
            {visibility ? "Public" : "Private"}
          </Text>
        </View>
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
        onPress={toggleVisibility}
        style={styles.toggleButton}
      >
        <Text style={styles.toggleText}>
          {visibility ? "Make Private" : "Make Public"}
        </Text>
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
