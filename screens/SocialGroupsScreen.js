import React, { useState, useEffect } from "react";
import {
  Alert,
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  visibility,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  where,
  doc,
  deleteDoc,
  updateDoc,
  getDoc,
} from "@firebase/firestore";
import { FIREBASE_AUTH as auth } from "../firebaseConfig";

const SocialGroupsCard = ({
  id,
  title,
  description,
  image,
  time,
  group,
  tag,
  visibility, // Add visibility prop
}) => {
  const navigation = useNavigation();

  // Function to delete social group
  const deleteSocialGroup = async () => {
    const db = getFirestore();
    await deleteDoc(doc(db, "socialgroups", id));
  };

  // Function to toggle visibility of the event
  const toggleVisibility = async () => {
    const db = getFirestore();
    const socialGroupRef = doc(db, "socialgroups", id);
    const socialGroupSnapshot = await getDoc(socialGroupRef);
    const currentUser = auth.currentUser;

    if (socialGroupSnapshot.exists() && currentUser) {
      const data = socialGroupSnapshot.data();
      if (data.creator.uid === currentUser.uid) {
        // Only allow the creator to change visibility
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
            visibility, // Pass the visibility property so this is how props are passed
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
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggleVisibility}
        style={styles.toggleButton}
      >
        <Text style={styles.toggleText}>
          {visibility ? "Public" : "Private"}
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

const SocialGroupsScreen = () => {
  const isFocused = useIsFocused();
  const [socialgroups, setSocialGroups] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (isFocused) {
      const db = getFirestore();
      const q = query(
        collection(db, "socialgroups"),
        where("group", "==", "Social Group")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let socialGroupsData = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          let formattedTime = "";
          if (typeof data.time === "string") {
            let parts = data.time.split(/[\s/:,]+/);
            let date = new Date(
              Date.UTC(
                parts[2],
                parts[1] - 1,
                parts[0],
                parts[3],
                parts[4],
                parts[5]
              )
            );
            if (isNaN(date)) {
              console.error("Could not parse date string:", data.time);
            } else {
              formattedTime = date.toLocaleString();
            }
          }

          socialGroupsData.push({ id: doc.id, ...data, time: formattedTime });
        });
        setSocialGroups(socialGroupsData);
      });

      return () => unsubscribe();
    }
  }, [isFocused]);

  const renderItem = ({ item }) => (
    <SocialGroupsCard
      id={item.id}
      title={item.name}
      description={item.description}
      image={item.image}
      time={item.time}
      group={item.group}
      tag={item.tag}
      visibility={item.visibility} // Pass the visibility property
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Social Groups</Text>
        <FlatList
          data={socialgroups}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </View>
    </SafeAreaView>
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

export default SocialGroupsScreen;
