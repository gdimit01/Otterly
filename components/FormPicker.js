import React from "react";
import { View, StyleSheet } from "react-native";
import RNPickerSelect from "react-native-picker-select";

const FormPicker = ({ onValueChange, items, placeholder }) => {
  return (
    <View style={styles.input}>
      <RNPickerSelect
        onValueChange={onValueChange}
        items={items}
        placeholder={placeholder}
        style={{
          inputIOS: { color: "black", paddingHorizontal: 10 }, // You can customize the color and other styles as needed
          inputAndroid: { color: "black", paddingHorizontal: 10 },
        }}
      />
    </View>
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

export default FormPicker;
