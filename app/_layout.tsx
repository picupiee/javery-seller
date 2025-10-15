import "@/global.css";
import { router, Slot, SplashScreen, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { AuthProvider, useAuth } from "../context/AuthContext";

SplashScreen.preventAutoHideAsync();

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

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <View className="flex-row gap-2">
          <ActivityIndicator size="large" color="#f97316" />
          <Text className="text-lg">Mohon Menunggu...</Text>
        </View>
      </View>
    );
  }
  const inAuthGroup = segments[0] === "(auth)";

  useEffect(() => {
    if (user && inAuthGroup) {
      router.replace("/dashboard/home");
    } else if (!user && !inAuthGroup) {
      router.replace("/sign-in");
    }
  }, [user, inAuthGroup]);

  return <Slot />;
}
