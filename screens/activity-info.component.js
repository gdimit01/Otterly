import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export const ActivityInfo = ({ activity }) => (
  <View style={styles.container}>
    <Image source={{ uri: activity.image }} style={styles.image} />
    <Text style={styles.title}>{activity.title}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    margin: 10,
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
  },
  title: {
    marginTop: 10,
  },
});
