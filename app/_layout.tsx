import { Stack } from "expo-router";
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_500Medium,
  Tajawal_700Bold,
} from "@expo-google-fonts/tajawal";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { I18nManager } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueueProvider } from "../context/QueueContext";

SplashScreen.preventAutoHideAsync();

// Force RTL layout for the entire app
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Tajawal_400Regular,
    Tajawal_500Medium,
    Tajawal_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <StatusBar hidden />
      <QueueProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
            animationDuration: 220,
          }}
        />
      </QueueProvider>
    </SafeAreaProvider>
  );
}
