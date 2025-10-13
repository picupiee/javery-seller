import { auth } from "@/lib/firebase";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const signUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      if (Platform.OS == "web") {
        window.alert("Berhasil membuat akun !");
      } else {
        Alert.alert("Berhasil", "Selamat datang di Javery Seller");
      }
      router.push("/dashboard/home");
    } catch (error: any) {
      Alert.alert("Gagal membuat Akun !", error.message);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex items-center mt-20">
      <Text className="text-lg font-semibold border-2 p-1 rounded-md">
        Selamat datang di Javery Seller
      </Text>
      <View className="mt-8 flex-col items-center">
        <View className="flex-col gap-2">
          <TextInput
            placeholder="Alamat Email"
            // value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            className="p-2 placeholder:text-gray-500 text-md border-2 border-gray-300 focus:border-black focus:outline-none transition-colors ease-in-out rounded-m"
          />
          <TextInput
            placeholder="Kata Sandi"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            className="p-2 text-md placeholder:text-gray-500 border-2 border-gray-300 focus:border-black focus:outline-none transition-colors ease-in-out rounded-md"
          />
          {/* Store Name, but will add later */}
          {/* <TextInput
            placeholder="Nama Toko"
            value={storeName}
            onChangeText={setStoreName}
            className="p-2 placeholder:text-gray-500 text-md border-2 border-gray-300 focus:border-black focus:outline-none transition-colors ease-in-out rounded-md"
          /> */}
        </View>
        <Pressable
          className={`my-4 p-2 rounded-md items-center w-full ${
            loading ? "bg-orange-300" : "bg-orange-400"
          }`}
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text className="text-white font-semibold">
            {loading ? "Mendaftarkan..." : "Daftar"}
          </Text>
        </Pressable>
      </View>
      <View className="flex-row gap-2 items-center justify-center mt-4">
        <Text>Sudah memiliki akun ?</Text>
        <Text
          className="text-blue-500 font-semibold"
          onPress={() => router.push("/sign-in")}
        >
          Masuk Sekarang
        </Text>
      </View>
    </View>
  );
};

export default signUp;
