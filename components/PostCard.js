import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PostCard = ({ item, onDelete }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent}>{item.content}</Text>
      <Text style={styles.postAuthor}>By {item.author}</Text>
      <Text style={styles.deleteButton} onPress={() => onDelete(item.id)}>
        Delete
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CCCCCC",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
    marginBottom: 8,
  },
  postAuthor: {
    fontSize: 14,
    color: "#666666",
  },
  deleteButton: {
    alignSelf: "flex-end",
    color: "red",
    marginTop: 8,
  },
});

export default PostCard;
