import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { onSnapshot, collection, doc, getDoc } from "@firebase/firestore"; // Added doc, getDoc
import { FIREBASE_DB, FIREBASE_AUTH } from "../../firebaseConfig";
import InvitesCard from "../../src/components/InvitesGroup/InvitesCard";
import InvitesStyle from "../../src/assets/InvitesStyles";

const InvitesScreen = () => {
  const [sentInvites, setSentInvites] = useState([]);
  const [receivedInvites, setReceivedInvites] = useState([]);
  const [sentInvitesExpanded, setSentInvitesExpanded] = useState(false); // Added state variable
  const [receivedInvitesExpanded, setReceivedInvitesExpanded] = useState(false); // Added state variable
  const navigation = useNavigation();
  const currentEmail = FIREBASE_AUTH.currentUser.email;

  const fetchEventDetails = async (invite) => {
    const eventDoc = await getDoc(doc(FIREBASE_DB, "events", invite.eventId));
    return { ...eventDoc.data(), ...invite };
  };

  useEffect(() => {
    const unsubscribeSent = onSnapshot(
      collection(FIREBASE_DB, "invites"),
      async (snapshot) => {
        const updatedSentInvites = await Promise.all(
          snapshot.docs
            .filter((doc) => doc.data().senderId === currentEmail)
            .map((doc) => fetchEventDetails(doc.data()))
        );
        setSentInvites(updatedSentInvites);
      }
    );

    const unsubscribeReceived = onSnapshot(
      collection(FIREBASE_DB, "invites"),
      async (snapshot) => {
        const updatedReceivedInvites = await Promise.all(
          snapshot.docs
            .filter((doc) => doc.data().receiverEmail === currentEmail)
            .map((doc) => fetchEventDetails(doc.data()))
        );
        setReceivedInvites(updatedReceivedInvites);
      }
    );

    return () => {
      unsubscribeSent();
      unsubscribeReceived();
    };
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        // Navigate to the EventScreen with all the required parameters
        navigation.navigate("EventScreen", {
          id: item.id,
          title: item.name,
          description: item.description,
          image: item.image,
          time: item.time,
          group: item.group,
          tag: item.tag,
          visibility: item.visibility,
          // Include any other required parameters
        });
      }}
    >
      <InvitesCard
        name={item.name}
        creator={item.creator}
        status={item.status}
        onDelete={() => console.log("Delete invite")}
      />
    </TouchableOpacity>
  );

  return (
    <View style={InvitesStyle.container}>
      <TouchableOpacity
        onPress={() => setSentInvitesExpanded(!sentInvitesExpanded)}
      >
        <Text style={InvitesStyle.heading}>Sent Invites</Text>
      </TouchableOpacity>
      {sentInvitesExpanded && (
        <FlatList
          data={sentInvites}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      <TouchableOpacity
        onPress={() => setReceivedInvitesExpanded(!receivedInvitesExpanded)}
      >
        <Text style={InvitesStyle.heading}>Received Invites</Text>
      </TouchableOpacity>
      {receivedInvitesExpanded && (
        <FlatList
          data={receivedInvites}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

export default InvitesScreen;
