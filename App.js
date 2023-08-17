import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { EventProvider } from "./src/context/EventContext";
import { AppNavigator } from "./infrastructure/navigation/app.navigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { UserProvider } from "./src/context/UserContext";
import { LogBox } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";

// Initialize a QueryClient
const queryClient = new QueryClient();

// Ignore specific logbox warnings
LogBox.ignoreLogs(["Constants.platform.ios.model has been deprecated"]);

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    // Load the FontAwesome font asynchronously
    const loadFonts = async () => {
      try {
        await FontAwesome.loadFont();
        setFontLoaded(true);
      } catch (error) {
        console.error("Error loading fonts: ", error);
      }
    };

    loadFonts();
  }, []);

  if (!fontLoaded) {
    return null; // Return null or a loading screen until fonts are loaded
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <EventProvider>
          <UserProvider>
            <PaperProvider>
              <AppNavigator />
            </PaperProvider>
          </UserProvider>
        </EventProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
