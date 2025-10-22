import Buttons from "@/components/ui/Buttons";
import { getProductById, Product, updateProduct } from "@/lib/productService";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
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
  const [productImage, setProductImage] = useState<string | null>(null);
  const [originalProduct, setOriginalProduct] = useState<Product | null>(null);

  // UI State
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 1. Loading Data

  const loadProduct = async () => {
    if (!id) {
      setError("ID Produk tidak ditemukan");
      setInitialLoading(false);
      return;
    }
    setError("");
    setInitialLoading(true);

    try {
      const productId = id as string;
      const product = await getProductById(productId);

      if (product) {
        setName(product.name);
        setPrice(product.price ? product.price.toString() : "0");
        setStock(product.stock ? product.stock.toString() : "0");
        setProductImage(product.imageUrl ? product.imageUrl.toString() : null);
        setOriginalProduct(product);
      } else {
        setError("Produk tidak ditemukan.");
      }
    } catch (err: any) {
      console.error("Load product error :", err);
      // Use a clearer error for the user
      setError("Gagal memuat informasi produk. Cek koneksi Anda.");
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
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

  const handleEditImage = async () => {
    // const imageInfo = await selectAndManipulateImage();
    // if (imageInfo) {
    //   setProductImage(imageInfo.uri);
    // }
    Alert.alert(
      "Fitur ini belum tersedia",
      "Silahkan hapus produk ini dan buat ulang dengan gambar yang berbeda."
    );
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
        imageUrl: productImage || "",
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
        <Buttons
          title="Coba Lagi"
          className="p-3 bg-blue-500 rounded-lg shadow-md w-full"
          textStyle="text-white text-center font-bold text-lg"
          // ⚠️ Call the product loading function here
          onPress={() => loadProduct()}
        />
        <Buttons
          title="Batal"
          className="p-3 bg-red-500 rounded-lg shadow-md mt-2"
          textStyle="text-white text-center font-bold text-lg"
          // This navigates back to the previous screen (product list)
          onPress={() => router.back()}
        />
      </View>
    );
  }

  const cancelSubmission = async () => {
    if (originalProduct) {
      // Reset all states back to the original values
      setName(originalProduct.name);
      setPrice(originalProduct.price ? originalProduct.price.toString() : "0");
      setStock(originalProduct.stock ? originalProduct.stock.toString() : "0");
      setProductImage(
        originalProduct.imageUrl ? originalProduct.imageUrl.toString() : null
      );
      setError(""); // Clear any error messages
    }
    router.replace("/dashboard/(user)/products");
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="p-6 bg-white"
    >
      <Text className="text-2xl font-bold mb-8 text-gray-800">Edit Produk</Text>
      <View className="mb-4">
        {productImage && (
          <View className="mb-4 w-full h-64">
            <Image
              source={{ uri: productImage }}
              className="w-full h-64 rounded-lg "
              resizeMode="cover"
            />
            <View className="absolute bottom-4 left-4 right-4 z-10">
              <Buttons
                title="Ubah Gambar"
                className="bg-blue-600/70 p-3 rounded-md"
                textStyle="text-center text-white font-medium"
                onPress={handleEditImage}
              />
            </View>
          </View>
        )}
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
      <Buttons
        title="Batal"
        className="p-3 bg-red-500 rounded-lg shadow-md mt-2"
        textStyle="text-white text-center font-bold text-lg"
        onPress={cancelSubmission}
      />
    </ScrollView>
  );
};

export default EditProduct;
