import React from "react";
import { View, StyleSheet, Platform, useWindowDimensions } from "react-native";
import RNPickerSelect from "react-native-picker-select";

const FormPicker = ({ onValueChange, items, placeholder }) => {
  const windowWidth = useWindowDimensions().width;

  return (
    <View style={[styles.container, { width: windowWidth * 0.8 }]}>
      <RNPickerSelect
        onValueChange={onValueChange}
        items={items}
        placeholder={placeholder}
        style={pickerSelectStyles}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: "10%",
    marginRight: "10%",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    padding: 10,
    color: "black",
  },
  inputAndroid: {
    padding: Platform.OS === "android" ? 0 : 10, // remove padding for android
    color: "black",
  },
});

export default FormPicker;
