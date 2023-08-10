import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { getFirestore, doc, updateDoc } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

const InvitesActions = ({ event, eventId }) => {
  const auth = getAuth();
  const currentUserEmail = auth.currentUser ? auth.currentUser.email : null;

  const isInvitedUser = event.invites.some(
    (invite) => invite.email === currentUserEmail
  );

  if (!isInvitedUser) {
    return null; // Don't render anything if the current user is not invited
  }

  const updateInviteStatus = async (status) => {
    try {
      const db = getFirestore();
      const eventRef = doc(db, "events", eventId);
      const updatedInvites = event.invites.map((invite) =>
        invite.email === currentUserEmail ? { ...invite, status } : invite
      );
      await updateDoc(eventRef, { invites: updatedInvites });
      alert("Status updated successfully!");
    } catch (error) {
      console.error("Error updating invite status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => updateInviteStatus("accepted")}
      >
        <Text style={styles.buttonText}>Accept</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => updateInviteStatus("maybe")}
      >
        <Text style={styles.buttonText}>Maybe</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => updateInviteStatus("declined")}
      >
        <Text style={styles.buttonText}>Decline</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "magenta",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
  },
});

export default InvitesActions;
