/**
 * The `MessageCard` component is a reusable React Native component that displays a message with
 * different styles based on whether it is from the current user or another user.
 * @returns The MessageCard component is being returned.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MessageCard = ({ message, currentUserEmail, otherUserName }) => {
  const isFromCurrentUser = message.senderEmail === currentUserEmail;

  return (
    <View
      style={isFromCurrentUser ? styles.fromCurrentUser : styles.toCurrentUser}
    >
      <Text style={styles.sender}>
        {isFromCurrentUser ? "You" : otherUserName}
      </Text>
      <Text style={styles.messageText}>{message.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  fromCurrentUser: {
    backgroundColor: "#f0f8ff",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignSelf: "flex-end",
  },
  toCurrentUser: {
    backgroundColor: "#e6e6fa",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  sender: {
    fontWeight: "bold",
  },
  messageText: {
    marginTop: 5,
  },
});

export default MessageCard;
