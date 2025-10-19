import Buttons from "@/components/ui/Buttons";
import { useAuth } from "@/context/AuthContext";
import { createProduct } from "@/lib/productService";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TextInput, View } from "react-native";

const AddProductScreen = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Validation
  const validate = () => {
    setError("");
    if (!name.trim()) {
      setError("Nama produk wajib diisi");
      return false;
    }
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError("Harga harus berupa angka positif.");
      return false;
    }
    if (isNaN(parsedStock) || parsedStock <= 0) {
      setError("Stok harus lebih dari 0.");
      return false;
    }
    return true;
  };
  // 2. Submission
  const handleAddProduct = async () => {
    if (loading || !validate() || !user) return;
    setLoading(true);
    setError("");

    try {
      const newProduct = {
        ownerUid: user.uid,
        name: name.trim(),
        price: parseFloat(price),
        stock: parseInt(stock),
        // imageUrl: "" // For later
      };

      await createProduct(newProduct);
      Alert.alert("Berhasil", "Produk sukses ditambahkan.");
      setName("");
      setPrice("");
      setStock("");
      router.replace("/dashboard/products");
    } catch (err: any) {
      console.error("Add product error: ", err);
      setError(err.message || "Gagal menyimpan produk. Silahkan coba kembali.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="p-6 bg-white"
    >
      <Text className="text-2xl font-bold mb-8 text-gray-800">
        Tambah Produk
      </Text>
      <View className="mb-4">
        <Text className="text-sm font-medium mb-1 text-gray-700">
          Nama Produk
        </Text>
        <TextInput
          placeholder="Contoh: Kue Cucur"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          className="p-3 border border-gray-300 rounded-lg"
        />
      </View>

      <View className="mb-4">
        <Text className="text-sm font-medium mb-1 text-gray-700">
          Harga (Rp)
        </Text>
        <TextInput
          placeholder="Contoh: 25000"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          className="p-3 border border-gray-300 rounded-lg"
        />
      </View>

      <View className="mb-6">
        <Text className="text-sm font-medium mb-1 text-gray-700">
          Stok Produk
        </Text>
        <TextInput
          placeholder="Contoh: 100"
          value={stock}
          onChangeText={setStock}
          keyboardType="number-pad"
          className="p-3 border border-gray-300 rounded-lg"
        />
      </View>

      {error ? (
        <Text className="text-red-500 font-semibold text-center mb-4">
          {error}
        </Text>
      ) : null}

      <Buttons
        title="Simpan"
        onLoading="Menyimpan..."
        isLoading={loading}
        className="p-3 bg-orange-500 rounded-lg shadow-md"
        textStyle="text-white text-center font-bold text-lg"
        onPress={handleAddProduct}
      />
    </ScrollView>
  );
};

export default AddProductScreen;
