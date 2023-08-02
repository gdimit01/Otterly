import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { EventProvider, EventContext } from "./screens/EventContext";
import { AppNavigator } from "./infrastructure/navigation/app.navigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { LogBox } from "react-native";

// Initialize a QueryClient
const queryClient = new QueryClient();

LogBox.ignoreLogs(["Constants.platform.ios.model has been deprecated"]);

export default function App() {
  // Declare events state
  const [events, setEvents] = useState([]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <EventProvider>
          <EventContext.Provider value={[events, setEvents]}>
            <AppNavigator />
          </EventContext.Provider>
        </EventProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
