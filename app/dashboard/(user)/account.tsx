import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import React from "react";
import { Alert, Platform, Pressable, Text, View } from "react-native";

const account = () => {
  const { logout } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
      if (Platform.OS === "web") {
        // Use window.alert for web platforms
        window.alert("Berhasil keluar dari Akunmu\nTekan OK untuk melanjutkan");
      } else {
        // Use Alert.alert for native platforms
        Alert.alert("Berhasil Keluar", "Tekan OK untuk melanjutkan");
      }
      router.push("/");
    } catch (error) {
      console.error("Logout Error:", error);
      Alert.alert("Ada kesalahan pada aplikasi kami, silahkan paksa keluar.");
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg font-semibold">Akun dan Setelan</Text>
      <Pressable className="p-2 bg-red-500 rounded-md" onPress={handleLogout}>
        <Text className="text-center text-white">Keluar</Text>
      </Pressable>
    </View>
  );
};

export default account;
