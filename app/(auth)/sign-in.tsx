import Buttons from "@/components/ui/Buttons";
import { auth } from "@/lib/firebase";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Alert, Platform, Text, TextInput, View } from "react-native";

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const MIN_PASSWORD_LENGTH = 8;

const signIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
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

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const successMessage = "Selamat Datang\nKlik OK untuk melanjutkan.";
      if (Platform.OS === "web") {
        window.alert(successMessage);
      } else {
        Alert.alert(`Selamat Datang`, "Tekan OK untuk melanjutkan.");
      }
      router.push("/dashboard/home");
    } catch (error: any) {
      console.error("Sign-In error :", error.code, error.message);
      let userFriendlyError =
        "Gagal Masuk. Coba Periksa kembali email atau kata sandi anda.";
      switch (error.code) {
        case "auth/user-not-found":
        case "auth/invalid-credential":
          userFriendlyError =
            "Email atau kata sandi anda salah. Silahkan coba kembali.";
          break;
        case "auth/invalid-email":
          userFriendlyError = "Format email tidak valid";
          break;
        case "auth/too-many-requests":
          userFriendlyError =
            "Terlalu banyak percobaan. Akun anda diblokir untuk sementara waktu!";
          break;
        default:
          userFriendlyError =
            "Terjadi kesalahan pada sistem kami. Silahkan coba kembali atau hubungi admin aplikasi !";
      }
      setError(userFriendlyError);
      if (Platform.OS !== "web") {
        Alert.alert("Gagal masuk !", userFriendlyError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg font-semibold border-2 p-1 rounded-md">
        Selamat datang di Javery Seller
      </Text>
      <View className="flex-col items-center justify-center w-full mt-8 sm:w-96">
        <View className="gap-2 w-1/2">
          <TextInput
            placeholder="Alamat Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="p-2 text-black text-md border-2 border-gray-300 focus:border-black focus:outline-none rounded-md"
          />
          <TextInput
            placeholder="Kata Sandi"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            className="p-2 text-black text-md border-2 border-gray-300 focus:border-black focus:outline-none rounded-md"
          />
        </View>
        {error ? (
          <Text className="text-red-500 text-center font-semibold mt-2 w-full max-w-sm">
            {error}
          </Text>
        ) : null}
        <Buttons
          title="Masuk"
          onLoading="Mohon Menunggu..."
          isLoading={loading}
          className="my-4 p-2 bg-orange-400 rounded-md items-center w-52"
          onPress={handleSignIn}
        />
      </View>
      <View className="flex-row mt-2 gap-2">
        <Text className="text-slate-500">Lupa kata sandi ?</Text>
        <Text
          onPress={() => router.replace("/reset-password")}
          className="text-slate-500 font-semibold"
        >
          Reset Password
        </Text>
      </View>
      <View className="flex-row gap-2 items-center justify-center mt-2">
        <Text>Belum mempunyai akun ?</Text>
        <Text
          className="text-blue-500 font-semibold underline underline-offset-4"
          onPress={() => router.replace("/sign-up")}
        >
          Daftar Sekarang
        </Text>
      </View>
    </View>
  );
};

export default signIn;
