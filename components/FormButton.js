import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const FormButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "80%", // Set the width to 80% of the parent container
    marginLeft: "10%", // Add 10% margin to the left
    marginRight: "10%", // Add 10% margin to the right
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
