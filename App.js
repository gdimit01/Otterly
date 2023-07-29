import React from "react";
import { EventProvider } from "./screens/EventContext";
import { AppNavigator } from "./infrastructure/navigation/app.navigator"; // Import the AppNavigator

export default function App() {
  return (
    <EventProvider>
      <AppNavigator />
    </EventProvider>
  );
}
