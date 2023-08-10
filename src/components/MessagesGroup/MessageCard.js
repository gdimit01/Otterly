// MessageCard.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MessageCard = ({ message }) => {
  return (
    <View style={message.from === "Joe" ? styles.fromJoe : styles.toYou}>
      <Text style={styles.sender}>
        {message.from === "Joe" ? "Joe" : "You"}
      </Text>
      <Text style={styles.messageText}>{message.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  fromJoe: {
    backgroundColor: "#f0f8ff",
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  toYou: {
    backgroundColor: "#e6e6fa",
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  sender: {
    fontWeight: "bold",
  },
  messageText: {
    marginTop: 5,
  },
});

export default MessageCard;
