import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f7f7f7", // Light gray background for a clean look
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center", // Center text horizontally
    color: "#1C1C1C",
    alignSelf: "center", // Ensure this element is centered horizontally if the parent's alignItems isn't set to 'center'
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C1C1C", // Dark gray for contrast
    marginBottom: 10,
  },
  activitiesContainer: {
    margin: 10,
    height: 150,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  activityContainer: {
    margin: 10,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  card: {
    width: "100%",
    height: 120, // Slightly increased
    padding: 30,
    marginBottom: 20,
    backgroundColor: "#FFFFFF", // Pure white for clean cards
    borderRadius: 10, // Rounded corners
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000", // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "500", // Semi-bold
    color: "#333",
  },
  calendarCard: {
    width: "100%",
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  calendar: {
    // Add this style
    width: "100%", // This will make the calendar fit the card
    borderRadius: 10, // You can adjust this value as needed
  },
  calendarImage: {
    width: "100%", // Adjust as needed
    height: 100, // Adjust as needed
    resizeMode: "cover", // Adjust as needed
  },
  //this impacts the way the cards are rendered on the flatlist
  groupCardContainer: {
    flex: 1,
    marginHorizontal: -10,
    margin: 0, // Remove or reduce this margi
    width: 320, // Adjust the width as needed
    height: "100%", // Adjust the height to crop the card
    //overflow: "hidden", // Hide the overflow content
    borderRadius: 10, // Add border radius to curve the edges
    margin: 0, // Remove margin
  },
  groupCard: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    margin: 0, // Remove margin
  },
  noEventsCard: {
    padding: 20,
    margin: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  noEventsText: {
    fontSize: 16,
    color: "#333",
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

  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "darkorange", // Blue color, but you can choose your preferred color
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF", // Optional: Set a background color
  },
});

export default styles;
