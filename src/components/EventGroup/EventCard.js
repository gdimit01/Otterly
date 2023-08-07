import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const EventCard = ({
  id,
  title,
  description,
  image,
  time,
  group,
  tag,
  visibility,
  status,
  onPress,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <View style={styles.card}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.time}>{time}</Text>
          <Text style={styles.group}>Group: {group}</Text>
          <Text style={styles.tag}>#{tag}</Text>
          <Text style={styles.visibility}>
            Visibility: {visibility ? "Public" : "Private"}
          </Text>
          <Text style={styles.status}>Status: {status}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
    borderRadius: 10,
  },
  textContainer: {
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  time: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  group: {
    fontSize: 14,
    marginBottom: 10,
  },
  tag: {
    fontSize: 14,
    marginBottom: 10,
  },
  visibility: {
    fontSize: 14,
    marginBottom: 10,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#27ae60", // You can change this color based on the status
  },
});

export default EventCard;
