import React, { useState, useEffect } from "react";
import {
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
  doc,
  deleteDoc,
} from "@firebase/firestore";

const StudyGroupsCard = ({
  id,
  title,
  description,
  image,
  time,
  group,
  tag,
}) => {
  const navigation = useNavigation();

  // Function to delete study group
  const deleteStudyGroup = async () => {
    const db = getFirestore();
    await deleteDoc(doc(db, "studygroups", id));
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
        onPress={deleteStudyGroup}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const StudyGroupsScreen = () => {
  const isFocused = useIsFocused();
  const [studygroups, setStudyGroups] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (isFocused) {
      const db = getFirestore();
      const q = query(
        collection(db, "studygroups"),
        where("group", "==", "Study Group")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let studyGroupsData = [];
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

          studyGroupsData.push({ id: doc.id, ...data, time: formattedTime });
        });
        setStudyGroups(studyGroupsData);
      });

      return () => unsubscribe();
    }
  }, [isFocused]);

  const renderItem = ({ item }) => (
    <StudyGroupsCard
      id={item.id}
      title={item.name} // Pass the name property for title
      description={item.description}
      image={item.image}
      time={item.time}
      group={item.group} // Pass the group property
      tag={item.tag} // Pass the tag property
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Study Groups</Text>
        <FlatList
          data={studygroups}
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

export default StudyGroupsScreen;