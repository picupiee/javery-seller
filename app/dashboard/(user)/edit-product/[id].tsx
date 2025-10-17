import Buttons from "@/components/ui/Buttons";
import { getProductById, updateProduct } from "@/lib/productService";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const EditProduct = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  // State for form data
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // UI State
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 1. Loading Data
  useEffect(() => {
    if (!id) {
      setError("ID Produk tidak ditemukan.");
      setInitialLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        const product = await getProductById(id);

        if (product) {
          setName(product.name);
          setPrice(product.price ? product.price.toString() : "0");
          setStock(product.stock ? product.stock.toString() : "0");
        } else {
          setError("Produk tidak ditemukan.");
        }
      } catch (err: any) {
        console.error("Load product error :", err);
        setError("Gagal memuat informasi produk.");
      } finally {
        setInitialLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  // 2. Validation
  const validate = () => {
    setError("");
    if (!name.trim()) {
      setError("Nama produk wajib diisi.");
      return false;
    }
    const parsedPrice = parseFloat(price);
    const parsedStock = parseInt(stock);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError("Harga tidak boleh kosong");
      return false;
    }
    if (isNaN(parsedStock) || parsedStock <= 0) {
      setError("Stock tidak boleh kosong");
      return false;
    }
    return true;
  };

  // 3. Submission
  const handleUpdateProduct = async () => {
    if (saving || !validate() || !id) return;
    setSaving(true);
    setError("");

    try {
      const updates = {
        name: name.trim(),
        price: parseFloat(price),
        stock: parseInt(stock),
      };
      await updateProduct(id, updates);

      Alert.alert("Sukses", "Produk berhasil diperbarui");
      router.replace("/dashboard/products");
    } catch (err: any) {
      console.error("Update product error :", err);
      setError(
        err.message || "Gagal memperbarui produk anda. Silahkan coba lagi."
      );
    } finally {
      setSaving(false);
    }
  };

  // 4. UI Render
  if (initialLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="mt-2 text-gray-600">Memuat detail produk...</Text>
      </View>
    );
  }

  if (error && !saving) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-red-600 font-semibold mb-4 text-center">
          {error}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="p-6 bg-white"
    >
      <Text className="text-2xl font-bold mb-8 text-gray-800">Edit Produk</Text>
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

      <Buttons
        title="Simpan"
        onLoading="Menyimpan..."
        isLoading={saving}
        className="p-3 bg-orange-500 rounded-lg shadow-md"
        textStyle="text-white text-center font-bold text-lg"
        onPress={handleUpdateProduct}
      />
    </ScrollView>
  );
};

export default EditProduct;
