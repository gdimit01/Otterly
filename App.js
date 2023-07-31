import React from "react";
import { EventProvider } from "./screens/EventContext";
import { AppNavigator } from "./infrastructure/navigation/app.navigator"; // Import the AppNavigator
import { GestureHandlerRootView } from "react-native-gesture-handler";

// import * as Device from "expo-device";

// console.log(Device.modelName);

import { LogBox } from "react-native";

LogBox.ignoreLogs(["Constants.platform.ios.model has been deprecated"]);

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <EventProvider>
        <AppNavigator />
      </EventProvider>
    </GestureHandlerRootView>
  );
}
