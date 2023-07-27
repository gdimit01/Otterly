import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const LabelInput = ({ label, ...props }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "80%", // Set the width to 80% of the parent container
    marginLeft: "10%", // Add 10% margin to the left
    marginRight: "10%", // Add 10% margin to the right
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
    fontWeight: "bold",
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
});

export default LabelInput;
