import React, { useState, useEffect } from "react";
import { TextInput, Card, Title, Paragraph } from "react-native-paper";
import {
  View,
  SafeAreaView,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  Text,
  StatusBar,
} from "react-native";
import { FIREBASE_AUTH as auth } from "../../firebaseConfig";
import {
  getFirestore,
  doc,
  onSnapshot,
  collection,
  query,
  where,
} from "@firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormButton from "../../components/FormButton";
import LabelInput from "../../components/LabelInput";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/hooks/useAuth";

const ProfileScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [studyGroupCount, setStudyGroupCount] = useState(0);
  const [socialGroupCount, setSocialGroupCount] = useState(0);
  const { user, firstName, surname, handleSignOut } = useAuth();

  const navigateToSettings = () => {
    try {
      navigation.navigate("SettingsScreen");
    } catch (error) {
      console.error("Navigation error:", error);
      // Handle navigation error here (you could show an alert, for example)
      Alert.alert(
        "Navigation Error",
        "There was a problem navigating to the settings screen. Please try again."
      );
    }
  };

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      console.log("Auth state changed:", user);
      if (user) {
        const db = getFirestore();
        const docRef = doc(db, "users", user.uid);

        // Subscribe to real-time updates for the user document
        const unsubscribeUserDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setName(docSnap.data().firstName + " " + docSnap.data().surname);
            setEmail(user.email);
          } else {
            console.log("No such document!");
          }
        });

        // Subscribe to real-time updates for Study Groups
        const studyGroupQuery = query(
          collection(db, "events"),
          where("userId", "==", user.uid),
          where("group", "==", "Study Group")
        );

        //This is useful to remember that you are engaging real time with the db
        const unsubscribeStudyGroups = onSnapshot(
          studyGroupQuery,
          (snapshot) => {
            // Set the count of study groups the user is associated with
            setStudyGroupCount(snapshot.size);
          },
          (error) => console.log("Error fetching study group updates:", error)
        );

        // Subscribe to real-time updates for Social Groups
        const socialGroupQuery = query(
          collection(db, "events"),
          where("userId", "==", user.uid),
          where("group", "==", "Social Group")
        );

        const unsubscribeSocialGroups = onSnapshot(
          socialGroupQuery,
          (snapshot) => {
            // Set the count of social groups the user is associated with
            setSocialGroupCount(snapshot.size);
          },
          (error) => console.log("Error fetching social group updates:", error)
        );

        // Return a cleanup function to unsubscribe from real-time updates when the component unmounts
        return () => {
          unsubscribeUserDoc();
          unsubscribeStudyGroups();
          unsubscribeSocialGroups();
        };
      }
    });

    // Cleanup subscription on unmount
    return unsubscribeAuth;
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
      <TouchableOpacity
        style={styles.settingsIcon}
        onPress={navigateToSettings}
      >
        <Ionicons name="ios-settings" size={30} color="#000" />
      </TouchableOpacity>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
        <View style={styles.content}>
          <Image
            style={styles.profileImage}
            source={{ uri: "https://placebear.com/159/150" }}
          />
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userEmail}>{email}</Text>
          <View style={styles.cardsContainer}>
            <Card style={styles.card}>
              <Card.Content>
                <Title>Study Group Associations</Title>
                <Paragraph>{studyGroupCount}</Paragraph>
              </Card.Content>
            </Card>
            <Card style={styles.card}>
              <Card.Content>
                <Title>Social Group Associations</Title>
                <Paragraph>{socialGroupCount}</Paragraph>
              </Card.Content>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    padding: 10,
    alignItems: "center",
  },
  settingsIcon: {
    left: 315,
    bottom: 10,
    padding: 10,
  },

  content: {
    padding: 20,
    alignItems: "center",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    alignSelf: "flex-start",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 20,
    paddingLeft: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 12,
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    margin: 5,
  },
});

export default ProfileScreen;
