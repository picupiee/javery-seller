import "@/global.css";
import { Redirect, Slot, useSegments } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect } from "react";

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}

function AppLayout() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();

  if (isLoading) {
    return (
      <View className="flex-row gap-2">
        <ActivityIndicator size="large" color="black" />
        <Text>Mohon Menunggu...</Text>
      </View>
    );
  }
  const inAuthGroup = segments[0] === '(auth)'

  useEffect(() => {
    if (user && inAuthGroup) {
      <Redirect href="/dashboard/home" />
    } else if (!user && !inAuthGroup) {
      <Redirect href="/" />
    }
  }, [user, inAuthGroup])

  return <Slot />
}
