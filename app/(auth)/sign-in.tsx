import { router } from "expo-router";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const signIn = () => {
  return (
    <View className="flex items-center mt-20">
      <Text className="text-lg font-semibold border-2 p-1 rounded-md">
        Selamat datang di Javery Seller
      </Text>
      <View className="mt-8 flex-col items-center">
        <View className="flex-col gap-2 w-full">
          <TextInput
            placeholder="Alamat Email"
            // value={email}
            // onChangeText={() => void}
            keyboardType="email-address"
            className="p-2 placeholder:text-gray-500 text-md border-2 border-gray-300 focus:border-black focus:outline-none transition-colors ease-in-out rounded-md"
          />
          <TextInput
            placeholder="Kata Sandi"
            secureTextEntry
            // value={password}
            // onChangeText={() => void}
            className="p-2 text-md placeholder:text-gray-500 border-2 border-gray-300 focus:border-black focus:outline-none transition-colors ease-in-out rounded-md"
          />
        </View>
        <Pressable className="my-4 p-2 bg-orange-400 rounded-md items-center w-full">
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
