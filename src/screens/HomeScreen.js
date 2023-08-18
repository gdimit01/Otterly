/**
 * The HomeScreen component is a React Native screen that displays user information and a list of
 * available events.
 * @returns The HomeScreen component is being returned.
 */
import React, { useState, useEffect, useContext } from "react";
import { FontAwesome } from "@expo/vector-icons";
import {
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
  View,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/core";
import { useAuth } from "../../src/hooks/useAuth";
import styles from "../../src/assets/HomeScreen.styles";
import { ActivityItem } from "../../src/components/ActivityItem";
import { EventContext } from "../../src/context/EventContext";
import SocialGroupsCard from "../../src/components/SocialGroups/SocialGroupsCard";
import StudyGroupsCard from "../../src/components/StudyGroups/StudyGroupsCard";
import { Calendar } from "react-native-calendars";

export const HomeScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { user, firstName, surname, handleSignOut } = useAuth();
  const { events = [] } = useContext(EventContext); // Get events from context

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Combine social and study group events
  const combinedEvents = events.filter(
    (event) => event.group === "Social Group" || event.group === "Study Group"
  );

  // Filter events based on visibility and user invitation
  const filteredEvents = combinedEvents.filter((event) => {
    if (event.visibility) return true;
    if (event.creator && event.creator.email === user?.email) return true;

    if (
      event.invites &&
      event.invites.some(
        (invite) => invite.email === user?.email && invite.status === "accepted"
      )
    ) {
      return true;
    }

    return false;
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Home</Text>
      <ScrollView contentContainerStyle={styles.container}>
        {user ? (
          <View style={styles.userInfoContainer}>
            <Text style={styles.greetingText}>
              Hi {firstName} {surname}
            </Text>
          </View>
        ) : (
          <Text>No user is signed in.</Text>
        )}
        <Text style={styles.title}>Available events</Text>
        {filteredEvents.length > 0 ? (
          <FlatList
            horizontal
            data={filteredEvents}
            renderItem={({ item }) => (
              <View style={styles.groupCardContainer}>
                <Text
                  style={styles.eventTitle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.title}
                </Text>
                <View style={styles.groupCard}>
                  {item.group === "Social Group" ? (
                    <SocialGroupsCard
                      id={item.id}
                      showButtons={false}
                      showDetailsOnly={true}
                      showOptions={false}
                    />
                  ) : (
                    <StudyGroupsCard
                      id={item.id}
                      showButtons={false}
                      showDetailsOnly={true}
                    />
                  )}
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <View style={styles.noEventsCard}>
            <Text style={styles.noEventsText}>
              Looks like there are no events at the moment
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
