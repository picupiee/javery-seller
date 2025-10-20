import { useAuth } from "@/context/AuthContext";
import {
  Order,
  OrderStatus,
  subscribeToSellerOrders,
} from "@/lib/orderService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return "text-red-500";
    case "processing":
      return "text-yellow-500";
    case "shipped":
      return "text-blue-500";
    case "delivered":
      return "text-green-500";
    case "cancelled":
      return "text-red-500";
    default:
      return "text-gray-800";
  }
};

const orderList = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRetry = () => setRefreshTrigger((prev) => prev + 1);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToSellerOrders(user.uid, (newOrders) => {
      setOrders(newOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, refreshTrigger]);

  // Render Logic
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="mt-2 text-gray-600">Memuat daftar pesanan...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg font-semibold text-red-600 mb-4">{error}</Text>
        <Text className="text-blue-500" onPress={handleRetry}>
          Coba muat ulang
        </Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-white">
        <Ionicons name="sad-sharp" size={64} color="#9ca3af" />
        <Text className="text-xl font-bold text-center text-gray-800 mb-2">
          Belum ada pesanan
        </Text>
        <Text className="text-lg text-center text-gray-600">
          Pesanan baru akan muncul disini.
        </Text>
        <Pressable
          onPress={handleRetry}
          className="flex-row items-center mt-10 gap-2"
        >
          <Text className="text-blue-500 text-lg">
            Muat Ulang Daftar Pesanan
          </Text>
          <Ionicons name="refresh-circle" size={24} color="blue" />
        </Pressable>
      </View>
    );
  }

  // Helper for single item
  const renderOrderItem = ({ item }: { item: Order }) => (
    <Pressable
      className="p-4 m-2 bg-white rounded-lg shadow-sm border border-gray-200"
      onPress={() => router.push(`/dashboard/(user)/order-detail/${item.id}`)}
    >
      <Text className="text-md font-bold mb-1">
        Order #
        <Text className="font-normal">
          {item.id.substring(0, 8).toUpperCase()}
        </Text>
      </Text>
      <Text className="text-lg font-semibold">{item.buyerName}</Text>
      <Text className="text-sm text-gray-700">
        Total : Rp{item.totalAmount.toLocaleString("id-ID")}
      </Text>
      <Text className={`mt-2 font-bold ${getStatusColor(item.status)}`}>
        Status: {item.status.toUpperCase()}
      </Text>
    </Pressable>
  );

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={renderOrderItem}
      ListHeaderComponent={() => (
        <Text className="text-2xl font-bold p-4 pb-2">
          Daftar Pesanan ({orders.length})
        </Text>
      )}
    />
  );
};

export default orderList;
