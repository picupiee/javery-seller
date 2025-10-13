import { auth } from "@/lib/firebase";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

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
    <View className="flex items-center mt-20">
      <Text className="text-lg font-semibold border-2 p-1 rounded-md">
        Selamat datang di Javery Seller
      </Text>
      <View className="mt-8 flex-col items-center">
        <View className="flex-col gap-2">
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
          className="my-4 p-2 bg-orange-400 rounded-md items-center w-full"
          onPress={handleSignIn}
        >
          <Text className="text-white font-semibold">Masuk</Text>
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
