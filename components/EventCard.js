// EventCard.js
import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text } from "react-native";
import firebase from "../firebaseConfig";

const EventCard = ({ event, compact, onCardPress }) => {
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = firebase.firestore().collection("events").doc(event.id);
        const doc = await docRef.get();
        if (doc.exists) {
          setEventData(doc.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    fetchData();
  }, [event]);

  return (
    <TouchableOpacity
      onPress={onCardPress}
      style={{ padding: 10, margin: 10, backgroundColor: "lightgrey" }}
    >
      {compact ? (
        <Text>{eventData?.name}</Text>
      ) : (
        <>
          <Text>{eventData?.name}</Text>
          <Text>{eventData?.description}</Text>
          <Text>{eventData?.date}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default EventCard;
