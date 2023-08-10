// MessagesScreen.js
import React from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import MessageCard from "../../src/components/MessagesGroup/MessageCard"; // Adjust the path as needed

const MessagesScreen = () => {
  const navigation = useNavigation();
  const messages = [
    { from: "Joe", text: "Hey, how are you?" },
    { from: "You", text: "I'm good, thanks! How about you?" },
    { from: "Joe", text: "Doing well, thanks for asking!" },
    // Add more messages as needed
  ];

  const handlePressMessage = (message) => {
    // Navigate to another screen, passing the message as a parameter
    navigation.navigate("MessageDetails", { message });
  };

  return (
    <View>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handlePressMessage(item)}>
            <MessageCard message={item} />
          </TouchableOpacity>
        )}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

export default MessagesScreen;
