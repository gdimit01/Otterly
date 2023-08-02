import React from "react";
import { View, Image, Text } from "react-native";
import styles from "../../src/assets/HomeScreen.styles";

export const ActivityItem = ({ item }) => (
  <View style={styles.activityContainer}>
    <Image source={{ uri: item.image }} style={styles.activityImage} />
    <Text style={styles.activityTitle}>{item.title}</Text>
  </View>
);
