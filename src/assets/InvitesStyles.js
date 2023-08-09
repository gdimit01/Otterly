import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  invitesTime: {
    fontSize: 14,
    marginTop: 5,
    color: "#888",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  invitesCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 10,
  },
  invitesCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  invitesTextContainer: {
    flex: 1,
  },
  invitesTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  invitesDescription: {
    fontSize: 16,
    marginTop: 5,
  },
  invitesStatus: {
    fontSize: 14,
    marginTop: 5,
    color: "#888",
  },
});

export default styles;
