// CreateEventScreen.js
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Alert,
  Button,
} from "react-native";
import { getFirestore, getDoc, doc, onSnapshot } from "@firebase/firestore";
import { FIREBASE_AUTH as auth } from "../../firebaseConfig";
import CreateEventFunction from "../../src/components/CreateEventsGroup/CreateEventFunction";
import FormButton from "../../components/FormButton";
import FormInput from "../../components/FormInput";
import FormPicker from "../../components/FormPicker";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

const db = getFirestore();

const CreateEventScreen = () => {
  const [step, setStep] = useState(0);
  const [creator, setCreator] = useState("");
  const [invites, setInvites] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [tag, setTag] = useState(null);
  const [group, setGroup] = useState(null);
  const [isEventCreated, setIsEventCreated] = useState(false);
  const navigation = useNavigation(); // Add this line to get the navigation prop

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log("Auth state changed:", user);

      if (user) {
        const db = getFirestore();
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setCreator({
            email: docSnap.data().email,
            firstName: docSnap.data().firstName,
            surname: docSnap.data().surname,
          });
        } else {
          console.log("No such document!");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const createEvent = CreateEventFunction({
    eventName,
    eventLocation,
    eventDescription,
    creator,
    invites,
    tag,
    group,
    onSuccess: () => {
      // Update the onSuccess callback
      Alert.alert("Success", "Event successfully created", [
        {
          text: "OK",
          onPress: () => {
            resetForm();
          },
        },
      ]);
    },
  });

  useEffect(() => {
    if (isEventCreated) {
      createEvent();
      resetForm();
    }
  }, [isEventCreated]);

  const nextStep = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      setIsEventCreated(true);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const resetForm = () => {
    setStep(0);
    setCreator("");
    setInvites("");
    setEventName("");
    setEventLocation("");
    setEventDescription("");
    setTag(null);
    setGroup(null);
    setIsEventCreated(false);
  };

  const renderTabContent = () => {
    switch (step) {
      case 0:
        return (
          <EventNameTab
            eventName={eventName}
            setEventName={setEventName}
            nextStep={nextStep}
          />
        );
      case 1:
        return (
          <EventLocationTab
            eventLocation={eventLocation}
            setEventLocation={setEventLocation}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 2:
        return (
          <EventDescriptionTab
            eventDescription={eventDescription}
            setEventDescription={setEventDescription}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <InvitesTab
            invites={invites}
            setInvites={setInvites}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 4:
        return (
          <TagTab
            tag={tag}
            setTag={setTag}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 5:
        return (
          <GroupTab
            group={group}
            setGroup={setGroup}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 6:
        return (
          <CreateEventTab
            createEvent={createEvent}
            resetForm={resetForm}
            prevStep={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Event Creation</Text>
      </View>
      <View style={styles.tabContainer}>
        <TabBar step={step} />
      </View>
      <View style={styles.container}>{renderTabContent()}</View>
      {isEventCreated && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Event Summary:</Text>
          <Text style={styles.summaryText}>Event Name: {eventName}</Text>
          <Text style={styles.summaryText}>
            Event Location: {eventLocation}
          </Text>
          <Text style={styles.summaryText}>
            Event Description: {eventDescription}
          </Text>
          <Text style={styles.summaryText}>Tag: {tag}</Text>
          <Text style={styles.summaryText}>Group: {group}</Text>
          <FormButton title="Create Another Event" onPress={resetForm} />
        </View>
      )}
      <View style={styles.tabIndicatorContainer}>
        <View
          style={[styles.tabIndicator, { width: `${(step + 1) * (100 / 7)}%` }]}
        />
      </View>
    </SafeAreaView>
  );
};

const TabBar = ({ step }) => {
  return (
    <View style={styles.tabBar}>
      <View style={[styles.tab, step === 0 && styles.activeTab]} />
      <View style={[styles.tab, step === 1 && styles.activeTab]} />
      <View style={[styles.tab, step === 2 && styles.activeTab]} />
      <View style={[styles.tab, step === 3 && styles.activeTab]} />
      <View style={[styles.tab, step === 4 && styles.activeTab]} />
      <View style={[styles.tab, step === 5 && styles.activeTab]} />
      <View style={[styles.tab, step === 6 && styles.activeTab]} />
    </View>
  );
};
const EventNameTab = ({ eventName, setEventName, nextStep }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event Name</Text>
      <FormInput
        style={styles.input}
        placeholder="Event Name"
        value={eventName}
        onChangeText={setEventName}
      />
      <Button title="Next" onPress={nextStep} disabled={!eventName} />
    </View>
  );
};

const EventLocationTab = ({
  eventLocation,
  setEventLocation,
  nextStep,
  prevStep,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event Location</Text>
      <FormInput
        style={styles.input}
        placeholder="Event Location"
        value={eventLocation}
        onChangeText={setEventLocation}
      />
      <Button title="Next" onPress={nextStep} disabled={!eventLocation} />
      <Button title="Previous" onPress={prevStep} />
    </View>
  );
};

const EventDescriptionTab = ({
  eventDescription,
  setEventDescription,
  nextStep,
  prevStep,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event Description</Text>
      <FormInput
        style={styles.input}
        placeholder="Event Description"
        value={eventDescription}
        onChangeText={setEventDescription}
      />
      <Button title="Next" onPress={nextStep} disabled={!eventDescription} />
      <Button title="Previous" onPress={prevStep} />
    </View>
  );
};

const InvitesTab = ({ invites, setInvites, nextStep, prevStep }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invites</Text>
      <FormInput
        style={styles.input}
        placeholder="Invites (comma separated emails)"
        value={invites}
        onChangeText={setInvites}
      />
      <Button title="Next" onPress={nextStep} disabled={!invites} />
      <Button title="Previous" onPress={prevStep} />
    </View>
  );
};

const TagTab = ({ tag, setTag, nextStep, prevStep }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tag</Text>
      <FormPicker
        onValueChange={(value) => setTag(value)}
        items={[
          { label: "Computer Science", value: "Computer Science" },
          { label: "Cultural", value: "Cultural" },
          { label: "Dance", value: "Dance" },
        ]}
        placeholder={{ label: "Select a tag...", value: null }}
      />
      <Button title="Next" onPress={nextStep} disabled={!tag} />
      <Button title="Previous" onPress={prevStep} />
    </View>
  );
};

const GroupTab = ({ group, setGroup, nextStep, prevStep }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Group</Text>
      <FormPicker
        onValueChange={(value) => setGroup(value)}
        items={[
          { label: "Study Group", value: "Study Group" },
          { label: "Social Group", value: "Social Group" },
        ]}
        placeholder={{ label: "Select a group...", value: null }}
      />
      <Button title="Next" onPress={nextStep} disabled={!group} />
      <Button title="Previous" onPress={prevStep} />
    </View>
  );
};

const CreateEventTab = ({ createEvent, resetForm, prevStep }) => {
  return (
    <View style={styles.container}>
      <FormButton title="Create Event" onPress={createEvent} />
      <Button title="Previous" onPress={prevStep} />
      <Button title="Start Over" onPress={resetForm} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    width: "80%",
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderColor: "#c4c4c4",
    borderWidth: 1,
    borderRadius: 8,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 30,
  },
  tab: {
    flex: 1,
    height: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: "#007AFF",
  },
  tabIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 5,
    width: "100%",
    backgroundColor: "#fff",
    marginTop: 2,
  },
  tabIndicator: {
    height: 5,
    backgroundColor: "#007AFF",
  },
  summaryContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default CreateEventScreen;
