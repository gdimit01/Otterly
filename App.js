/**
 * This is a React Native app component that sets up the necessary providers and navigation for the
 * app.
 * @returns The App component is returning a JSX element. The JSX element is wrapped in several context
 * providers and a QueryClientProvider. The JSX element being returned is the AppNavigator component.
 */
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { EventProvider } from "./src/context/EventContext"; // Import EventProvider
import { AppNavigator } from "./infrastructure/navigation/app.navigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Font from "expo-font";
import { FontAwesome } from "@expo/vector-icons";
import { UserProvider } from "./src/context/UserContext";

import { LogBox } from "react-native";

// Initialize a QueryClient
const queryClient = new QueryClient();

LogBox.ignoreLogs(["Constants.platform.ios.model has been deprecated"]);

export default function App() {
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
          <UserProvider>
            <AppNavigator />
          </UserProvider>
        </EventProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
