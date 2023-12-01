import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  SafeAreaView,
  View,
  StatusBar,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useAuth } from "../../src/hooks/useAuth";
import styles from "../../src/assets/HomeScreen.styles";
import { EventContext } from "../../src/context/EventContext";
import GroupCard from "../../src/components/GroupCard";

export const HomeScreen = () => {
  const { user, firstName, surname } = useAuth();
  const { events = [] } = useContext(EventContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filterEvents = (event) => {
    return (
      event.visibility ||
      (event.creator && event.creator.email === user?.email) ||
      (event.invites &&
        event.invites.some(
          (invite) =>
            invite.email === user?.email && invite.status === "accepted"
        ))
    );
  };

  const renderEvent = ({ item }) => (
    <View style={styles.groupCardContainer}>
      <Text style={styles.eventTitle} numberOfLines={1} ellipsisMode="tail">
        {item.title}
      </Text>
      <GroupCard
        id={item.id}
        showButtons={false}
        showDetailsOnly={true}
        showOptions={false}
      />
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Home</Text>
        {user && (
          <View style={styles.userInfoContainer}>
            <Text style={styles.greetingText}>
              Hi {firstName} {surname}
            </Text>
          </View>
        )}
        <Text style={styles.title}>Available events</Text>
        <FlatList
          horizontal
          data={events.filter(filterEvents)}
          renderItem={renderEvent}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatListContent}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
