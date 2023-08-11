import React, { useContext, useEffect } from "react";
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

  // Combine social and study group events
  const combinedEvents = events.filter(
    (event) => event.group === "Social Group" || event.group === "Study Group"
  );

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
            <Text>Email: {user.email}</Text>
          </View>
        ) : (
          <Text>No user is signed in.</Text>
        )}
        <Text style={styles.title}>Social and Study Groups</Text>
        <FlatList
          horizontal // Enable horizontal scrolling
          data={combinedEvents}
          renderItem={({ item }) => (
            <View style={styles.groupCard}>
              {item.group === "Social Group" ? (
                <SocialGroupsCard id={item.id} />
              ) : (
                <StudyGroupsCard id={item.id} />
              )}
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
        />

        <View style={styles.calendarCard}>
          <Text style={styles.cardText}>Calendar</Text>
          <Calendar
            style={styles.calendar}
            current={"2022-08-16"}
            minDate={"2022-05-10"}
            maxDate={"2022-06-30"}
            onDayPress={(day) => {
              console.log("selected day", day);
            }}
            monthFormat={"yyyy MM"}
            onMonthChange={(month) => {
              console.log("month changed", month);
            }}
            hideArrows={false}
            renderArrow={(direction) => (
              <FontAwesome
                name={direction === "left" ? "arrow-left" : "arrow-right"}
                size={24}
              />
            )}
            hideExtraDays={false}
            disableMonthChange={false}
            firstDay={1}
            hideDayNames={false}
            showWeekNumbers={false}
            onPressArrowLeft={(subtractMonth) => subtractMonth()}
            onPressArrowRight={(addMonth) => addMonth()}
          />
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.button}>
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
