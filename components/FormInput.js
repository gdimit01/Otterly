import React, { useState } from "react";
import { TextInput, StyleSheet, View, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const FormInput = ({ testID, value, onChangeText, placeholder, secure }) => {
  const [passwordVisible, setPasswordVisible] = useState(true);

  return (
    <View style={styles.container}>
      <TextInput
        testID={testID}
        value={value}
        style={styles.input}
        placeholder={placeholder}
        secureTextEntry={secure ? passwordVisible : false}
        onChangeText={onChangeText}
        autoCapitalize="none"
        keyboardType={secure ? "default" : "email-address"}
      />
      {secure && (
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <FontAwesome
            name={passwordVisible ? "eye-slash" : "eye"}
            size={22}
            color="grey"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 10,
    width: "80%",
    marginLeft: "10%",
    marginRight: "10%",
  },
  input: {
    flex: 1,
    padding: 10,
  },
  icon: {
    position: "absolute",
    right: 10,
  },
});

export default FormInput;
