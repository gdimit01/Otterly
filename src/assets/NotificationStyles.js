import { StyleSheet } from "react-native";

const NotificationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  notificationImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  notificationDescription: {
    fontSize: 16,
    marginTop: 5,
  },
  notificationTime: {
    fontSize: 14,
    marginTop: 5,
    color: "#888",
  },
  radioButton: {
    marginRight: 10,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editButton: {
    fontSize: 18,
    color: "blue",
  },
  deleteButton: {
    fontSize: 18,
    color: "red",
    textAlign: "right",
  },
  rightActionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
    height: "100%",
    justifyContent: "flex-end",
  },
  moreAction: {
    backgroundColor: "grey",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
    borderRadius: 10,
  },
  flagAction: {
    backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
    borderRadius: 10,
  },
  deleteAction: {
    backgroundColor: "#dd2c00",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
    borderRadius: 10,
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    padding: 10,
  },
  notificationGroup: {
    color: "#0000FF",
    fontSize: 12,
    fontWeight: "bold",
    position: "absolute",
    top: -10,
    right: -15,
  },
  notificationTag: {
    color: "#0000FF",
    fontSize: 12,
    fontWeight: "bold",
    position: "absolute",
    bottom: -10,
    right: -15,
  },
});

export default NotificationStyles;
