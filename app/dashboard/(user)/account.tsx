import Buttons from "@/components/ui/Buttons";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Platform, Text, View } from "react-native";

const account = () => {
  const { user, logout } = useAuth();
  const storeName = user?.profile?.storeName || "Nama Toko Belum Ditetapkan";
  const email = user?.email || "Email tidak ditemukan";
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (Platform.OS === "web") {
      const confirm = window.confirm(
        "Yakin ingin keluar dari aplikasi Javery Seller ?"
      );
      if (confirm) {
        logout();
      }
    }
    if (loading) return;
    const confirmLogout = () => {
      Alert.alert(
        "Keluar dari Javery",
        "Yakin ingin keluar dari aplikasi Javery Seller ?",
        [
          { text: "Batal", style: "cancel" },
          { text: "Keluar", onPress: executeLogout, style: "destructive" },
        ]
      );
    };
    const executeLogout = async () => {
      setLoading(true);
      try {
        await logout();
        router.replace("/sign-in");
      } catch (error) {
        console.error("Logout error: ", error);
        Alert.alert(
          "Terjadi Kesalahan",
          "Sepertinya ada kesalahan. Silahkan paksa keluar dari aplikasi kami!"
        );
      } finally {
        setLoading(false);
      }
    };
    confirmLogout();
  };

  return (
    <View className="flex-1 p-6">
      <View className="bg-slate-300 p-4 rounded-lg shadow-md mb-8">
        <Text className="text-xl font-bold mb-4 text-gray-800">
          Informasi Akun
        </Text>
        <View className="mb-3">
          <Text className="text-xs text-gray-500">Toko Anda</Text>
          <Text className="text-lg font-semibold text-orange-600">
            {storeName}
          </Text>
        </View>
        <View className="mb-3">
          <Text className="text-xs text-gray-500">Email Anda</Text>
          <Text className="text-lg font-semibold text-orange-600">{email}</Text>
        </View>
      </View>
      {/* Reserved for button section (Change Password, Store Name, all related store and account settings) */}
      {/* Placeholder for future settings*/}
      <View className="border-t border-gray-200 pt-4">
        <Text className="text-sm font-semibold mb-2">Setelan Aplikasi</Text>
        {/* Other settings related stuff added from here */}
      </View>
      <Buttons
        title="Keluar"
        isLoading={loading}
        onLoading="Proses Keluar..."
        className="mt-8 p-3 bg-red-600 rounded-md shadow-md"
        textStyle="text-white text-center font-bold text-lg"
        onPress={handleLogout}
      />
    </View>
  );
};

export default account;
