import { useAuth } from "@/context/AuthContext";
import React from "react";
import { Text, View } from "react-native";

const dashboardHome = () => {
  const { user } = useAuth();
  const storeName = user?.profile?.storeName || "Toko Anda";

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg font-semibold">Selamat Datang, {storeName}</Text>
    </View>
  );
};

export default dashboardHome;
