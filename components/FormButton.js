import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const FormButton = ({ title, onPress, testID }) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      testID={testID} // Pass the testID prop to TouchableOpacity
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "80%",
    marginLeft: "10%",
    marginRight: "10%",
    backgroundColor: "#f64060",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default FormButton;
