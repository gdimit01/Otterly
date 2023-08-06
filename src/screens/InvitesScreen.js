import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { EventContext } from "../context/EventContext";
import { collection, onSnapshot } from "@firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../firebaseConfig";

const InvitesScreen = () => {
  const [sentInvites, setSentInvites] = useState([]);
  const [receivedInvites, setReceivedInvites] = useState([]);

  const { events } = useContext(EventContext);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(FIREBASE_DB, "events"),
      (snapshot) => {
        const updatedSentInvites = [];
        const updatedReceivedInvites = [];

        snapshot.forEach((doc) => {
          const { invites, name, creator } = doc.data();

          if (invites && invites.length > 0) {
            const sent = invites.filter(
              () => creator.email === FIREBASE_AUTH.currentUser.email
            );
            const received = invites.filter(
              () => creator.email !== FIREBASE_AUTH.currentUser.email
            );

            updatedSentInvites.push(
              ...sent.map((invite) => ({
                ...invite,
                name,
                creator,
              }))
            );
            updatedReceivedInvites.push(
              ...received.map((invite) => ({
                ...invite,
                name,
                creator,
              }))
            );
          }
        });

        setSentInvites(updatedSentInvites);
        setReceivedInvites(updatedReceivedInvites);
      }
    );

    return () => unsubscribe();
  }, [events]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.itemText}>
        C: {item.creator.firstName} {item.creator.surname}
      </Text>
      <Text style={styles.statusText}>{item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sent Invites</Text>
      <FlatList
        data={sentInvites}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />

      <Text style={styles.heading}>Received Invites</Text>
      <FlatList
        data={receivedInvites}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
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
