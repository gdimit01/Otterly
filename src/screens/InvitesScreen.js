/**
 * The `InvitesScreen` component displays a list of sent and received invites for events.
 * @returns The `InvitesScreen` component is being returned.
 */
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
    const updatedSentInvites = [];
    const updatedReceivedInvites = [];

    events.forEach((event) => {
      const { invites, creator } = event;

      if (invites && invites.length > 0) {
        invites.forEach((invite) => {
          if (creator.email === FIREBASE_AUTH.currentUser.email) {
            updatedSentInvites.push({ ...event, invite });
          }
          if (invite.email === FIREBASE_AUTH.currentUser.email) {
            updatedReceivedInvites.push({ ...event, invite });
          }
        });
      }
    });

    setSentInvites(updatedSentInvites);
    setReceivedInvites(updatedReceivedInvites);
  }, [events]);

  const renderItem = ({ item }) => <InvitesCard event={item} />;

  return (
    <View style={InvitesStyle.container}>
      <TouchableOpacity
        onPress={() => setSentInvitesExpanded(!sentInvitesExpanded)}
        style={{ flexDirection: "row", justifyContent: "space-between" }}
      >
        <Text style={InvitesStyle.heading}>Sent Invites</Text>
        <Text style={InvitesStyle.smallText}>
          {sentInvitesExpanded ? "click to retract" : "click to expand"}
        </Text>
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
        style={{ flexDirection: "row", justifyContent: "space-between" }}
      >
        <Text style={InvitesStyle.heading}>Received Invites</Text>
        <Text style={InvitesStyle.smallText}>
          {receivedInvitesExpanded ? "click to retract" : "click to expand"}
        </Text>
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
