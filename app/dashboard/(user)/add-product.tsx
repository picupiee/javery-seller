import Buttons from "@/components/ui/Buttons";
import { useAuth } from "@/context/AuthContext";
import { createProduct } from "@/lib/productService";
import { uploadImageToCloudinary } from "@/utils/cloudinary";
import { selectAndManipulateImage } from "@/utils/imagePicker";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, ScrollView, Text, TextInput, View } from "react-native";

const AddProductScreen = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [originalFilename, setOriginalFilename] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setName("");
    setPrice("");
    setStock("");
    setLocalImageUri(null);
    setOriginalFilename(null);
  };

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
  // 1.A Image Selection
  const handlePickImage = async () => {
    const imageInfo = await selectAndManipulateImage();
    if (imageInfo) {
      setLocalImageUri(imageInfo.uri);
      setOriginalFilename(imageInfo.filename);
    }
  };

  // 2. Submission
  const handleAddProduct = async () => {
    if (loading || !validate() || !user) return;
    setLoading(true);
    setError("");

    try {
      let imageUrl = "";
      if (localImageUri) {
        imageUrl = await uploadImageToCloudinary(localImageUri, user!.uid);
      }

      const newProduct = {
        ownerUid: user.uid,
        name: name.trim(),
        price: parseFloat(price),
        stock: parseInt(stock),
        imageUrl: imageUrl,
      };

      await createProduct(newProduct);
      Alert.alert("Berhasil", "Produk sukses ditambahkan.");
      resetForm();
      router.replace("/dashboard/products");
    } catch (err: any) {
      console.error("Add product error: ", err);
      setError(err.message || "Gagal menyimpan produk. Silahkan coba kembali.");
    } finally {
      setLoading(false);
    }
  };
  // Product Submission Cancellation
  const handleCancel = () => {
    router.replace("/dashboard/products");
    resetForm();
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
          className="p-3 border border-gray-300 rounded-lg placeholder:text-gray-400"
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
          className="p-3 border border-gray-300 rounded-lg placeholder:text-gray-400"
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
          className="p-3 border border-gray-300 rounded-lg placeholder:text-gray-400"
        />
      </View>
      <View className="mb-6 border-t-2 border-b-2 pb-4 border-gray-400">
        <Text className="pt-2 text-xs">Upload Foto Produk </Text>
        {localImageUri ? (
          <View className="my-2 w-full items-center">
            <Text className="text-sm font-medium mb-2 text-gray-700">
              Pratinjau Gambar:
            </Text>
            <Image
              source={{ uri: localImageUri }}
              className="w-40 h-40 rounded-lg border border-gray-300"
              resizeMode="cover"
            />
          </View>
        ) : null}
        <Buttons
          title={
            originalFilename
              ? `${originalFilename}\nGanti Gambar`
              : "Pilih Gambar"
          }
          onPress={handlePickImage}
          className="mt-4 p-3 bg-blue-500 rounded-lg"
          textStyle="text-white text-center font-semibold"
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
        onPress={handleCancel}
      />
    </ScrollView>
  );
};
export default AddProductScreen;
