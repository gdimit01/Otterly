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
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  where,
} from "@firebase/firestore";
import { FIREBASE_AUTH as auth } from "../../firebaseConfig";
import SocialGroupsCard from "../../src/components/SocialGroups/SocialGroupsCard";

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
          socialGroupsData.push({ id: doc.id, ...data });
        });
        setSocialGroups(socialGroupsData);
      });

      return () => unsubscribe();
    }
  }, [isFocused]);

  const renderItem = ({ item }) => {
    return (
      <SocialGroupsCard
        id={item.id}
        title={item.name}
        description={item.description}
        image={item.image}
        time={item.time}
        group={item.group}
        tag={item.tag}
        visibility={item.visibility}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
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
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
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
    color: "#0000FF",
    fontSize: 12,
    fontWeight: "bold",
  },
  tag: {
    color: "#0000FF",
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
