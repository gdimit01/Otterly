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
    width: 200,
    height: 100,
    resizeMode: "contain",
  },
  slogan: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    ...Platform.select({
      ios: {
        fontFamily: "Helvetica",
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    width: "130%",
    height: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    ...Platform.select({
      ios: {
        fontFamily: "Helvetica",
      },
      android: {
        fontFamily: "Roboto",
      },
    }),
  },
  text: {
    color: "#fff",
    marginTop: 20,
  },
  link: {
    color: "#f64060",
    textDecorationLine: "underline",
  },
});
