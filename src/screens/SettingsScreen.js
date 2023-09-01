import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import Dialog from "react-native-dialog";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormButton from "../../components/FormButton";
import LabelInput from "../../components/LabelInput";
import { useAuth } from "../../src/hooks/useAuth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "@firebase/firestore";
import {
  signInWithEmailAndPassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { FIREBASE_AUTH as auth } from "../../firebaseConfig";

const SettingsScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const firestore = getFirestore();
  const { user, firstName, surname, handleSignOut } = useAuth();

  const loadName = async () => {
    const storedName = await AsyncStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const db = getFirestore();
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setName(docSnap.data().firstName);
          setEmail(user.email);
        }
      }
    });

    loadName();
    return unsubscribe;
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      const db = getFirestore();
      const docRef = doc(db, "users", user.uid);

      await setDoc(
        docRef,
        {
          firstName: name,
          lastUpdated: serverTimestamp(),
        },
        { merge: true }
      );

      await AsyncStorage.setItem("name", name);
      loadName();
      Alert.alert("Changes saved!", "");
    }
  };

  const showDialog = () => {
    setDialogVisible(true);
  };

  const handleCancel = () => {
    setDialogVisible(false);
  };

  const handleConfirm = () => {
    setDialogVisible(false);
    handleDeleteAccount();
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const timeSinceLastAuth =
          new Date().getTime() - data.lastAuth.toDate().getTime();

        if (timeSinceLastAuth > 5 * 60 * 1000) {
          setDialogVisible(true);
        } else {
          if (Platform.OS === "android") {
            // Add any Android-specific behavior here
            // e.g., you might want to show a Toast message or additional alert
          } else if (Platform.OS === "ios") {
            // Add any iOS-specific behavior here
          }
          deleteAccount(user, docRef);
        }
      }
    }
  };

  const deleteAccount = async (user, docRef) => {
    await deleteDoc(docRef);
    await AsyncStorage.removeItem("name");
    user
      .delete()
      .then(() => {
        Alert.alert(
          "Account Deleted",
          "Your account has been deleted. Press OK to return to the Welcome screen.",
          [
            {
              text: "OK",
              onPress: () => {
                navigation.popToTop();
                navigation.navigate("Welcome");
              },
            },
          ],
          { cancelable: false }
        );
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
        <View style={styles.content}>
          <Image
            style={styles.profileImage}
            source={{ uri: "https://placebear.com/159/150" }}
          />
          <Text style={styles.title}>Edit Profile</Text>
          <LabelInput label="Name" value={name} onChangeText={setName} />
          <Text style={styles.label}>Email</Text>
          <Text style={styles.input}>{email}</Text>
          <FormButton title="Save Changes" onPress={handleSave} />
          <FormButton title="Sign out" onPress={handleSignOut} />
          <FormButton title="Delete Account" onPress={showDialog} />
          <Dialog.Container visible={dialogVisible}>
            <Dialog.Title>Reauthenticate Account</Dialog.Title>
            <Dialog.Description>
              Please enter your email and password to continue.
            </Dialog.Description>
            <Dialog.Input
              label="Email"
              value={email}
              onChangeText={(input) => setEmail(input)}
            />
            <Dialog.Input
              label="Password"
              secureTextEntry={true}
              value={password}
              onChangeText={(input) => setPassword(input)}
            />
            <Dialog.Button label="Cancel" onPress={handleCancel} />
            <Dialog.Button label="Delete" onPress={handleConfirm} />
          </Dialog.Container>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 20,
  },
});

export default SettingsScreen;
