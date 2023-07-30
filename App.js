import React from "react";
import { EventProvider } from "./screens/EventContext";
import { AppNavigator } from "./infrastructure/navigation/app.navigator"; // Import the AppNavigator
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <EventProvider>
        <AppNavigator />
      </EventProvider>
    </GestureHandlerRootView>
  );
}
