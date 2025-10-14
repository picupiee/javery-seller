import { auth } from "@/lib/firebase";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const signIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Selamat Datang", "Tekan OK untuk melanjutkan.");
      router.push("/dashboard/home");
    } catch (error: any) {
      Alert.alert("Gagal masuk !", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg font-semibold border-2 p-1 rounded-md">
        Selamat datang di Javery Seller
      </Text>
      <View className="flex-col items-center justify-center w-full mt-8">
        <View className="gap-2 w-1/2">
          <TextInput
            placeholder="Alamat Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="p-2 placeholder:text-gray-500 text-md border-2 border-gray-300 focus:border-black focus:outline-none rounded-md"
          />
          <TextInput
            placeholder="Kata Sandi"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            className="p-2 text-md placeholder:text-gray-500 border-2 border-gray-300 focus:border-black focus:outline-none rounded-md"
          />
        </View>
        <Pressable
          className={`my-4 p-2 rounded-md items-center w-1/2 ${
            loading ? "bg-orange-300" : "bg-orange-400"
          }`}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text className="text-white font-semibold">
            {loading ? (
              <View className="flex-row items-center">
                <ActivityIndicator className="mr-2" size="small" color="#fff" />
                <Text className="text-white font-semibold">
                  Mohon Menunggu...
                </Text>
              </View>
            ) : (
              "Masuk"
            )}
          </Text>
        </Pressable>
      </View>
      <View className="flex-row gap-2 items-center justify-center mt-4">
        <Text>Belum mempunyai akun ?</Text>
        <Text
          className="text-blue-500 font-semibold"
          onPress={() => router.push("/sign-up")}
        >
          Daftar Sekarang
        </Text>
      </View>
    </View>
  );
};

export default signIn;
