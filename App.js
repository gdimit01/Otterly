import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { EventProvider, EventContext } from "./src/context/EventContext";
import { AppNavigator } from "./infrastructure/navigation/app.navigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Font from "expo-font";
import { FontAwesome } from "@expo/vector-icons";
import { UserProvider } from "./src/context/UserContext"; // Import UserProvider from UserContext

import { LogBox } from "react-native";

// Initialize a QueryClient
const queryClient = new QueryClient();

LogBox.ignoreLogs(["Constants.platform.ios.model has been deprecated"]);

export default function App() {
  // Declare events state
  const [events, setEvents] = useState([]);
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    loadFonts();
  }, []);

  const loadFonts = async () => {
    await Font.loadAsync({
      ...FontAwesome.font,
    });

    setFontLoaded(true);
  };

  if (!fontLoaded) {
    return null; // Return null or a loading screen until fonts are loaded
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <EventProvider>
          <EventContext.Provider value={[events, setEvents]}>
            <UserProvider>
              <AppNavigator />
            </UserProvider>
          </EventContext.Provider>
        </EventProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
