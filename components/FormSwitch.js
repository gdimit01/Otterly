import React from "react";
import { View, Switch, Text, StyleSheet } from "react-native";

const FormSwitch = ({ title, value, onValueChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={value ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
  },
});

export default FormSwitch;
