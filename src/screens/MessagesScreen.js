import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
} from "@firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import MessageCard from "../components/MessagesGroup/MessageCard";
import { getStatusBarHeight } from "react-native-status-bar-height";

const MessageScreen = () => {
  const [users, setUsers] = useState([]);
  const [showUsersList, setShowUsersList] = useState(false); // State to toggle users list
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const db = getFirestore();
  const flatListRef = useRef(null);

  const headerHeight = Platform.OS === "ios" ? 120 : 120; // Typical header height
  const statusBarHeight = getStatusBarHeight(); // Get the status bar height
  const keyboardVerticalOffset = headerHeight + statusBarHeight; // Combine both

  // Fetch all users except the current user
  useEffect(() => {
    const usersCollection = collection(db, "users");
    const usersQuery = query(
      usersCollection,
      where("email", "!=", currentUser.email)
    );
    getDocs(usersQuery).then((snapshot) => {
      const usersData = [];
      snapshot.forEach((doc) => usersData.push(doc.data()));
      setUsers(usersData);
    });
  }, [currentUser.email]);

  // Handle user selection and fetch messages
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    const conversationId = [currentUser.email, user.email].sort().join("_");
    const messagesCollection = collection(
      doc(collection(db, "conversations"), conversationId),
      "messages"
    );

    const messagesQuery = query(
      messagesCollection,
      orderBy("timestamp", "asc")
    );
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = [];
      snapshot.forEach((doc) => messagesData.push(doc.data()));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  };

  const handleSendMessage = async () => {
    if (input.trim() !== "" && selectedUser) {
      const conversationId = [currentUser.email, selectedUser.email]
        .sort()
        .join("_");
      const messagesCollection = collection(
        doc(collection(db, "conversations"), conversationId),
        "messages"
      );

      await addDoc(messagesCollection, {
        content: input.trim(),
        senderEmail: currentUser.email,
        timestamp: new Date().toISOString(),
      });
      setInput("");
      flatListRef.current.scrollToEnd({ animated: true }); // Scroll to the end after sending a message
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={keyboardVerticalOffset} // Pass the combined height
    >
      <View style={{ flex: 1 }}>
        {showUsersList && (
          <FlatList
            ref={flatListRef}
            data={users}
            style={styles.usersList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.userItem}
                onPress={() => handleUserSelect(item)}
              >
                <Text style={styles.userName}>{item.firstName}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
        <TouchableOpacity onPress={() => setShowUsersList(!showUsersList)}>
          <Text style={styles.toggleButton}>
            {showUsersList ? "Hide Users" : "Show Users"}
          </Text>
        </TouchableOpacity>
        {selectedUser && (
          <View style={{ flex: 9 }}>
            <Text>Conversation with {selectedUser.firstName}</Text>
            <FlatList
              data={messages}
              inverted={false}
              renderItem={({ item }) => (
                <MessageCard
                  message={item}
                  currentUserEmail={currentUser.email}
                  otherUserName={selectedUser.firstName}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}
          >
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f0f8ff",
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#007bff",
  },
  sendText: {
    color: "#fff",
  },
  toggleButton: {
    padding: 10,
    backgroundColor: "#f0f8ff",
    textAlign: "center",
    fontWeight: "bold",
  },
  usersList: {
    maxHeight: 150, // Limit the height of the list
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userName: {
    fontSize: 16,
  },
});
export default MessageScreen;
