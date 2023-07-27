import React from "react";
import { TextInput, StyleSheet } from "react-native";

const FormInput = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
}) => {
  return (
    <TextInput
      value={value}
      style={styles.input}
      placeholder={placeholder}
      autoCapitalize="none"
      secureTextEntry={secureTextEntry}
      onChangeText={onChangeText}
      keyboardType="email-address"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: "80%", // Set the width to 80% of the parent container
    marginLeft: "10%", // Add 10% margin to the left
    marginRight: "10%", // Add 10% margin to the right
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
});

export default FormInput;
