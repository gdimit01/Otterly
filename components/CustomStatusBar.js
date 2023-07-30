import React from "react";
import { StatusBar, Platform, View } from "react-native";

const CustomStatusBar = ({ backgroundColor, ...props }) => {
  if (Platform.OS === "android") {
    return (
      <View style={{ height: StatusBar.currentHeight }}>
        <StatusBar translucent backgroundColor={backgroundColor} {...props} />
      </View>
    );
  }

  return <StatusBar barStyle="dark-content" {...props} />;
};

export default CustomStatusBar;
