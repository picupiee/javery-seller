import Buttons from "@/components/ui/Buttons";
import { useAuth } from "@/context/AuthContext";
import { Product, subscribeToSellerProducts } from "@/lib/productService";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

const products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRetry = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToSellerProducts(user.uid, (newProducts) => {
      setProducts(newProducts);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user, refreshTrigger]);

  // Old Logic
  // const fetchProducts = async () => {
  //   if (!user) {
  //     setError("User not authenticated.");
  //     setLoading(false);
  //     router.replace("/sign-in");
  //     return;
  //   }

  //   setLoading(true);
  //   setError(null);
  //   try {
  //     // Augmented UID to fetch products
  //     const data = await getSellerProducts(user.uid);
  //     setProducts(data);
  //   } catch (err: any) {
  //     console.error(err);
  //     setError(err.message || "Terjadi kesalahan saat memuat produk");
  //     Alert.alert("Error", err.message || "Gagal saat memuat produk");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchProducts();
  // }, [user]);

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
        <Text className="text-blue-500 underline" onPress={handleRetry}>
          Coba muat ulang
        </Text>
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-gray-50">
        <Text className="text-xl font-bold text-gray-800 mb-2">
          Belum ada produk
        </Text>
        <Text
          className="text-center text-gray-600 p-2 bg-gray-100 border-black border-dashed border rounded-md"
          onPress={() => router.push("/dashboard/add-product")}
        >
          Tambahkan produk pertamamu untuk mulai berjualan!
        </Text>
        {/* Reserved for adding new product button if no product is fetched */}
      </View>
    );
  }

  // Helper for single product
  const renderProductItem = ({ item }: { item: Product }) => (
    <View className="p-4 m-2 bg-white rounded-lg shadow-sm border border-gray-100">
      <Text className="text-lg font-semibold">{item.name}</Text>
      <Text className="text-sm text-gray-700">Harga: Rp.{item.price}</Text>
      <Text className="text-sm text-gray-700">Stok: {item.stock}</Text>
    </View>
  );

  return (
    <View className="flex-1">
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProductItem}
        ListHeaderComponent={() => (
          <View className="p-4">
            <Text className="text-2xl font-bold p-4 pb-2">
              Daftar Produk ({products.length})
            </Text>
            <Buttons
              title="+ Tambah Produk Baru"
              className="p-3 bg-green-600 rounded-lg shadow-sm"
              textStyle="text-white text-center font-semibold"
              onPress={() => router.push("/dashboard/add-product")}
            />
          </View>
        )}
      />
    </View>
  );
};

export default products;
