import Buttons from "@/components/ui/Buttons";
import { useAuth } from "@/context/AuthContext";
import {
  deleteProduct,
  Product,
  subscribeToSellerProducts,
} from "@/utils/productService";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtils";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  Text,
  View,
} from "react-native";

const products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRetry = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  // Delete function
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const handleDelete = (product: Product) => {
    Alert.alert(
      "Hapus Produk",
      `Yakin ingin menghapus produk "${product.name}"?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          onPress: () => executeDelete(product.id),
          style: "destructive",
        },
      ]
    );
  };

  const executeDelete = async (productId: string) => {
    setDeletingId(productId);

    try {
      await deleteProduct(productId);
      showSuccessToast(
        "Produk Berhasil Dihapus",
        `Produkmu telah dihapus dari Tokomu !`
      );
    } catch (e: any) {
      console.error(e);
      showErrorToast(
        "Gagal Menghapus Produk!",
        "Ada kesalahan. Silahkan ulangi kembali."
      );
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (refreshTrigger > 0) {
    } else {
      setLoading(true);
    }
    setError(null);

    const unsubscribe = subscribeToSellerProducts(user.uid, (newProducts) => {
      setProducts(newProducts);
      setLoading(false);
      setIsRefreshing(false);
    });
    return () => unsubscribe();
  }, [user, refreshTrigger]);

  // Render logic
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="mt-2 text-gray-600">Memuat daftar produk...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-red-600 font-semibold mb-4">{error}</Text>
        <Buttons
          title="Muat Ulang"
          onPress={handleRetry}
          className="mt-4 bg-orange-600 p-3 rounded-lg"
        />
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-gray-50">
        <Ionicons name="basket-outline" size={64} color="#9ca3af" />
        <Text className="text-xl font-bold text-gray-800 my-4">
          Toko Anda belum memiliki Produk
        </Text>
        <Text className="text-lg text-center text-gray-600 mb-8">
          Tambahkan produk pertamamu untuk mulai berjualan!
        </Text>
        <Buttons
          title="+ Produk Baru"
          textStyle="text-center text-bold text-white"
          onPress={() => router.push("/dashboard/(user)/add-product")}
        />
      </View>
    );
  }

  // Helper for single product
  const renderProductItem = ({ item }: { item: Product }) => {
    const isDeleting = deletingId === item.id;
    const imageSrc = item.imageUrl;

    const productVisual = imageSrc ? (
      <Image
        className="mr-3 w-24 h-24 rounded-lg shadow-md border border-gray-100"
        source={{ uri: imageSrc }}
        resizeMode="cover"
      />
    ) : (
      <View className="mr-3 w-24 h-24 rounded-lg shadow-md border border-gray-200 bg-gray-100 items-center justify-center">
        <Ionicons name="cube-outline" size={40} color="#9ca3af" />
        <Text className="text-xs text-gray-500 mt-1">No Image</Text>
      </View>
    );

    return (
      <View
        className={`p-4 m-2 bg-white rounded-lg shadow-sm border border-gray-100 flex-row justify-between items-center ${isDeleting ? "opacity-50 border-red-500" : ""}`}
      >
        {productVisual}
        {/* <Image
          className="mr-3 w-24 h-24 rounded-lg shadow-md border border-gray-100"
          source={{ uri: imageSrc }}
          resizeMode="cover"
        /> */}
        <View className="flex-1 pr-4">
          <Text className="text-lg font-semibold">{item.name}</Text>
          <Text className="text-sm text-gray-700">
            Harga: Rp. {item.price.toLocaleString("id-ID")}
          </Text>
          <Text className="text-sm text-gray-700">Stok: {item.stock}</Text>
        </View>
        {isDeleting && (
          <View className="absolute inset-0 z-10 items-center justify-center bg-white/50">
            <Text className="text-lg font-bold text-red-600">Menghapus...</Text>
          </View>
        )}
        <View className="flex-row gap-2">
          {/* Edit Button */}
          <Buttons
            title="Edit"
            className="p-1 bg-orange-600 rounded-md"
            textStyle="text-white text-xs font-semibold"
            onPress={() =>
              router.push(`/dashboard/(user)/edit-product/${item.id}`)
            }
          />
          {/* Delete Button */}
          <Buttons
            title={isDeleting ? "..." : "Hapus"}
            isLoading={isDeleting}
            className={`p-1 rounded-md ${isDeleting ? "bg-gray-400" : "bg-red-600"}`}
            textStyle="text-white text-xs font-semibold"
            onPress={() => handleDelete(item)}
          />
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1">
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProductItem}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#f97316"
          />
        }
        ListHeaderComponent={() => (
          <View className="p-4 border-b bg-gray-100">
            <Text className="text-2xl font-bold pb-4">
              Daftar Produk ({products.length})
            </Text>
            <Buttons
              title="+ Produk Baru"
              textStyle="text-center text-bold text-white"
              onPress={() => router.push("/dashboard/(user)/add-product")}
            />
          </View>
        )}
      />
    </View>
  );
};

export default products;
