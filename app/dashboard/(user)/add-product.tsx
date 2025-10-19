import Buttons from "@/components/ui/Buttons";
import { useAuth } from "@/context/AuthContext";
import { createProduct } from "@/lib/productService";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TextInput, View } from "react-native";

const AddProductScreen = async () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pickImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Izin akses galeri kamera diperlukan!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const originalUri = result.assets[0].uri;
      try {
        const imageContext = ImageManipulator.ImageManipulator.manipulate(
          originalUri
        ).resize({ width: 1000 });
        const renderImage = await imageContext.renderAsync();
        const result = await renderImage.saveAsync({
          compress: 0.7,
          format: ImageManipulator.SaveFormat.JPEG,
        });
        setLocalImageUri(result.uri);
      } catch (e) {
        console.error("Error manipulating image:", e);
        Alert.alert("Error", "Gagal memproses gambar.");
      }
    }

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
        setError(
          err.message || "Gagal menyimpan produk. Silahkan coba kembali."
        );
      } finally {
        setLoading(false);
      }
    };

    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="p-6 bg-white mt-4"
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
        <Buttons
          title="Batal"
          className="p-3 bg-red-500 rounded-lg shadow-md mt-2"
          textStyle="text-white text-center font-bold text-lg"
          onPress={() => router.replace("/dashboard/products")}
        />
      </ScrollView>
    );
  };
};
export default AddProductScreen;
