import { StyleSheet } from "react-native";

const SharedStyles = StyleSheet.create({
  // Shared styles
  activityContainer: {
    margin: 10,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  activityImage: {
    // Style rules here...
  },
  activityTitle: {
    // Style rules here...
  },

  // HomeScreen styles
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  activitiesContainer: {
    height: 150,
    backgroundColor: "transparent",
  },
  card: {
    width: "100%",
    height: 100,
    padding: 30,
    marginBottom: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  calendarCard: {
    width: "100%",
    padding: 20,
    marginBottom: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  userInfoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  greetingText: {
    fontSize: 20,
    color: "#000000",
    fontWeight: "bold",
    fontStyle: "italic",
    textDecorationLine: "underline",
  },
});

export default SharedStyles;
