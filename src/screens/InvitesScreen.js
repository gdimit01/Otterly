import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { EventContext } from "../context/EventContext";
import { collection, onSnapshot } from "@firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../firebaseConfig";
import InvitesCard from "../components/InvitesGroup/InvitesCard";
import InvitesStyle from "../assets/InvitesStyles";
import { useNavigation } from "@react-navigation/native";

const InvitesScreen = () => {
  const navigation = useNavigation();
  const [sentInvites, setSentInvites] = useState([]);
  const [receivedInvites, setReceivedInvites] = useState([]);
  const [sentInvitesExpanded, setSentInvitesExpanded] = useState(false);
  const [receivedInvitesExpanded, setReceivedInvitesExpanded] = useState(false);

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
              (invite) => creator.email === FIREBASE_AUTH.currentUser.email
            );
            const received = invites.filter(
              (invite) => creator.email !== FIREBASE_AUTH.currentUser.email
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
    <InvitesCard
      name={item.name}
      creator={item.creator}
      status={item.status}
      id={item.id}
      title={item.title}
      description={item.description}
      image={item.image}
      time={item.time}
      group={item.group}
      tag={item.tag}
      onDelete={() => console.log("Delete invite")}
    />
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
