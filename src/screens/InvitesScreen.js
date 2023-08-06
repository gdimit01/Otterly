import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const InvitesScreen = () => {
  // Dummy data for sent and received invites (replace with actual data)
  const sentInvites = [
    { id: "1", status: "Accepted", user: "User A" },
    { id: "2", status: "Pending", user: "User B" },
    { id: "3", status: "Declined", user: "User C" },
  ];

  const receivedInvites = [
    { id: "1", status: "Accepted", user: "User X" },
    { id: "2", status: "Pending", user: "User Y" },
    { id: "3", status: "Pending", user: "User Z" },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.user}</Text>
      <Text style={styles.statusText}>{item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sent Invites</Text>
      <FlatList
        data={sentInvites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <Text style={styles.heading}>Received Invites</Text>
      <FlatList
        data={receivedInvites}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 16,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },
});

export default InvitesScreen;
