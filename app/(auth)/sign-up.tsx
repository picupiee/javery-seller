import Buttons from "@/components/ui/Buttons";
import { auth, db } from "@/lib/firebase";
import { router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, Platform, Text, TextInput, View } from "react-native";

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const MIN_PASSWORD_LENGTH = 8;

const signUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    if (loading) return;
    setError("");
    if (!isValidEmail(email)) {
      setError("Format email tidak valid.");
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Minimal kata sandi adalah ${MIN_PASSWORD_LENGTH} karakter.`);
      return;
    }
    if (!storeName) {
      setError("Nama toko wajib diisi.");
      return;
    }
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "sellers", user.uid), {
        uid: user.uid,
        email: user.email,
        storeName: storeName,
        createdAt: new Date().toISOString(),
      });
      const successMessage = `Selamat Bergabung ${storeName}\nKlik OK untuk melanjutkan.`;
      if (Platform.OS === "web") {
        window.alert(successMessage);
      } else {
        Alert.alert(
          `Selamat Datang ${storeName}`,
          "Tekan OK untuk melanjutkan."
        );
      }
      router.push("/dashboard/home");
    } catch (error: any) {
      console.error("Sign-In error :", error.code, error.message);
      let userFriendlyError =
        "Gagal Mendaftar. Periksa kembali email, password dan nama toko anda.";
      switch (error.code) {
        case "auth/too-many-requests":
          userFriendlyError =
            "Terlalu banyak percobaan. Silahkan tunggu hingga 10 menit sebelum melanjutkan";
          break;
        case "auth/email-already-in-use":
          userFriendlyError =
            "Email telah terdaftar! Gunakan alamat email yang berbeda.";
          break;
        default:
          userFriendlyError =
            "Terjadi kesalahan pada sistem kami. Silahkan coba kembali atau hubungi admin aplikasi !";
          break;
      }
      setError(userFriendlyError);
      if (Platform.OS !== "web") {
        Alert.alert("Gagal mendaftar !", userFriendlyError);
      }
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg font-semibold border-2 p-1 rounded-md">
        Selamat datang di Javery Seller
      </Text>
      <View className="flex-col items-center justify-center w-full mt-8 md:w-96">
        <View className="w-1/2">
          <Text className="text-md mt-2">Alamat Email</Text>
          <TextInput
            placeholder="contoh@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            className="p-2 text-black text-md border-2 border-gray-300 focus:border-black focus:outline-none"
          />
          <Text className="text-md mt-2">Password</Text>
          <TextInput
            placeholder="Masukkan kata sandi"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            className="p-2 text-black text-md border-2 border-gray-300 focus:border-black focus:outline-none"
          />
          <Text className="text-md mt-2">Nama Toko</Text>
          <TextInput
            placeholder="Contoh: 'Kedai Puri'"
            value={storeName}
            onChangeText={setStoreName}
            className="p-2 te4xt-black text-md border-2 border-gray-300 focus:border-black focus:outline-none"
          />
        </View>
        {error ? (
          <Text className="text-red-500 text-center font-semibold mt-1 w-full max-w-sm">
            {error}
          </Text>
        ) : null}
        <Buttons
          title="Daftar"
          onLoading="Mohon Menunggu..."
          isLoading={loading}
          className="my-4 p-2 bg-orange-400 rounded-md items-center w-52"
          onPress={handleSignUp}
        />
      </View>
      <View className="flex-row gap-2 items-center justify-center mt-4">
        <Text>Sudah memiliki akun ?</Text>
        <Text
          className="text-blue-500 font-semibold"
          onPress={() => router.replace("/sign-in")}
        >
          Masuk Sekarang
        </Text>
      </View>
    </View>
  );
};

export default signUp;
