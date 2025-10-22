import Buttons from "@/components/ui/Buttons";
import { auth } from "@/lib/firebase";
import { showSuccessToast } from "@/utils/toastUtils";
import { router } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { Alert, Platform, Text, TextInput, View } from "react-native";

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const resetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    if (loading) return;
    setError("");
    if (!isValidEmail(email)) {
      setError("Format email tidak valid.");
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      const successMessage =
        "Link untuk meresset password telah dikirim.\nSilahkan cek kotak masuk email anda untuk melanjutkan.";
      if (Platform.OS === "web") {
        window.alert(successMessage);
      } else {
        showSuccessToast("Reset Password Berhasil", "Silahkan cek kotak masuk email anda untuk melanjutkan.")
      }
      router.replace("/sign-in");
    } catch (error: any) {
      console.error("Password reset error :", error.code, error.message);
      let userFriendlyError =
        "Gagal mereset password anda. Perika kembali alamat email anda.";
      switch (error.code) {
        case "auth/invalid-email":
          userFriendlyError = "Format email tidak valid.";
          break;
        case "auth/user-not-found":
          userFriendlyError =
            "Permintaan tidak dapat diproses. Coba lagi nanti.";
          break;
        case "auth/too-many-request":
          userFriendlyError =
            "Terlalu banyak percobaan. Silahkan coba kembali setelah 10 menit.";
          break;
        default:
          userFriendlyError =
            "Ada kesalahan teknis. Silahkan mencoba kembali nanti.";
          break;
      }
      if (error.code && error.code !== "auth/user-not-found") {
        setError(userFriendlyError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg font-semibold border-2 p-1 rounded-md">
        Reset Akun Javery Seller
      </Text>
      <View className="flex-col items-center justify-center w-full mt-8 sm:w-96">
        <View className="gap-2 w-1/2">
          <TextInput
            placeholder="Alamat Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="p-2 placeholder:text-gray-500 text-md border-2 border-gray-300 focus:border-black focus:outline-none rounded-md"
          />
        </View>
        {error ? (
          <Text className="text-red-500 text-center font-semibold mt-2 w-full max-w-sm">
            {error}
          </Text>
        ) : null}
        <Buttons
          title="Reset"
          onLoading="Mohon Menunggu..."
          isLoading={loading}
          className="my-4 p-2 bg-orange-400 rounded-md items-center w-52"
          onPress={handleResetPassword}
        />
      </View>

      <View className="flex-row items-center justify-center">
        <Text
          className="text-blue-500 font-semibold"
          onPress={() => router.replace("/sign-in")}
        >
          Atau Masuk Sekarang
        </Text>
      </View>
    </View>
  );
};

export default resetPassword;
