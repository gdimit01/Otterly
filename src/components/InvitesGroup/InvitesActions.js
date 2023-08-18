/**
 * The `InvitesActions` component is a React Native component that allows invited users to accept,
 * decline, or mark themselves as maybe attending an event.
 * @returns The component is returning a View component that contains three TouchableOpacity
 * components. Each TouchableOpacity component has a Text component inside it. The TouchableOpacity
 * components are used as buttons to update the invite status. The buttons are labeled "Accept",
 * "Maybe", and "Decline".
 */
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

      // Calculate the new attendees count based on the updated invites array
      const newAttendeesCount = updatedInvites.filter(
        (invite) => invite.status === "accepted"
      ).length;

      // Debugging: Log the updated invites array and the new attendees count
      console.log("Updated Invites Array:", updatedInvites);
      console.log("New Attendees Count:", newAttendeesCount);

      // Update the invites field and the attendees count in the events collection
      await updateDoc(eventRef, {
        invites: updatedInvites,
        attendees: newAttendeesCount,
      });

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
