import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
} from "@firebase/firestore";

const InvitationsScreen = ({ route }) => {
  const { user } = route.params;
  const [sentInvitations, setSentInvitations] = useState([]);
  const [receivedInvitations, setReceivedInvitations] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const unsubscribeSent = onSnapshot(
      query(collection(db, "invitations"), where("inviter", "==", user.uid)),
      (snapshot) => {
        setSentInvitations(snapshot.docs.map((doc) => doc.data()));
      }
    );

    const unsubscribeReceived = onSnapshot(
      query(collection(db, "invitations"), where("invitee", "==", user.uid)),
      (snapshot) => {
        setReceivedInvitations(snapshot.docs.map((doc) => doc.data()));
      }
    );

    return () => {
      unsubscribeSent();
      unsubscribeReceived();
    };
  }, [user]);

  return (
    <View>
      <Text>Sent Invitations:</Text>
      {sentInvitations.map((invite) => (
        <Text key={invite.event}>{invite.status}</Text>
      ))}

      <Text>Received Invitations:</Text>
      {receivedInvitations.map((invite) => (
        <Text key={invite.event}>{invite.status}</Text>
      ))}
    </View>
  );
};

export default InvitationsScreen;
