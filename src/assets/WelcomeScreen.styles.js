import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  logo: {
    width: 300, // Increased from 200 to 300
    height: 120, // Increased from 100 to 150
    resizeMode: "contain",
  },
  slogan: {
    fontSize: 36, // Increased from 24 to 36
    fontWeight: "bold",
    color: "cyan",
    marginTop: 100,
    ...Platform.select({
      ios: {
        fontFamily: "Helvetica Neue",
      },
      android: {
        fontFamily: "Roboto",
      },
    }),
  },
  bottomContainer: {
    width: "80%",
    alignItems: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#f64060",
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
    height: 50,
    justifyContent: "center", // Center child components vertically
    alignItems: "center", // Center child components horizontally
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    ...Platform.select({
      ios: {
        fontFamily: "Helvetica Neue",
      },
      android: {
        fontFamily: "Roboto",
      },
    }),
  },
  text: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#fff",
    textDecorationLine: "underline",
    marginTop: 20,
    ...Platform.select({
      ios: {
        fontFamily: "Helvetica Neue",
      },
      android: {
        fontFamily: "Roboto",
      },
    }),
  },
  link: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#f64060",
    textDecorationLine: "underline",
    ...Platform.select({
      ios: {
        fontFamily: "Helvetica Neue",
      },
      android: {
        fontFamily: "Roboto",
      },
    }),
  },
});
