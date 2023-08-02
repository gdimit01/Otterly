import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
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
    margin: 10,
    height: 150, // Adjust this value as needed
    alignItems: "center",
    backgroundColor: "transparent", // Set the background color to transparent
  },
  activityContainer: {
    margin: 10,
    alignItems: "center",
    backgroundColor: "transparent", // Set the background color to transparent
  },
  card: {
    width: "100%", // Adjust as needed
    height: 100, // Adjust as needed
    padding: 30, // Increase padding
    marginBottom: 20, // Adjust as needed
    backgroundColor: "#f8f8f8", // Adjust as needed
    borderRadius: 10, // Adjust as needed
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    fontSize: 16, // Adjust as needed
    fontWeight: "bold", // Adjust as needed
  },
  calendarCard: {
    width: "100%", // Adjust as needed
    padding: 20, // Adjust as needed
    marginBottom: 20, // Adjust as needed
    backgroundColor: "#f8f8f8", // Adjust as needed
    borderRadius: 10, // Adjust as needed
    justifyContent: "center",
    alignItems: "center",
  },
  calendarImage: {
    width: "100%", // Adjust as needed
    height: 100, // Adjust as needed
    resizeMode: "cover", // Adjust as needed
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
  activityContainer: {
    margin: 10,
    alignItems: "center",
  },
  activityImage: {
    width: 100,
    height: 100,
  },
  activityTitle: {
    marginTop: 10,
  },
  greetingText: {
    fontSize: 20, // this sets the font size
    color: "#000000", // this sets the text color
    fontWeight: "bold", // this makes the text bold
    // You can add any other styles you want here. Some examples:
    fontStyle: "italic",
    textDecorationLine: "underline",
  },
});

export default styles;
