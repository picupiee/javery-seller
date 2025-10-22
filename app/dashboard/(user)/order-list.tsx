import Buttons from "@/components/ui/Buttons";
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
  RefreshControl,
  Text,
  View,
} from "react-native";

const getStatusColor = (status: OrderStatus) => {
  const base = "font-bold py-1 px-2 rounded-full text-xs";
  switch (status) {
    case "pending":
      return { text: "text-red-700", bg: "bg-red-100", label: "MENUNGGU" };
    case "processing":
      return {
        text: "text-yellow-700",
        bg: "bg-yellow-100",
        label: "DIPROSES",
      };
    case "shipped":
      return { text: "text-blue-700", bg: "bg-blue-100", label: "DIKIRIM" };
    case "delivered":
      return { text: "text-green-700", bg: "bg-green-100", label: "SELESAI" };
    case "cancelled":
      return { text: "text-red-700", bg: "bg-red-100", label: "DIBATALKAN" };
    default:
      return { text: "text-gray-700", bg: "bg-gray-100", label: "N/A" };
  }
};

const orderList = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = () => {
    setIsRefreshing(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  // const handleRetry = () => setRefreshTrigger((prev) => prev + 1);

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

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToSellerOrders(user.uid, (newOrders) => {
      setOrders(newOrders);
      setLoading(false);
      setIsRefreshing(false);
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
        <Text className="text-lg font-bold text-red-600 mb-4">{error}</Text>
        <Buttons
          title="Muat Ulang"
          onPress={onRefresh}
          className="mt-4 bg-orange-600 p-3 rounded-lg"
        />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-white">
        <Ionicons name="time-outline" size={64} color="#9ca3af" />
        <Text className="text-xl font-bold text-center text-gray-800 mb-2">
          Belum ada pesanan
        </Text>
        <Text className="text-lg text-center text-gray-600">
          Pesanan baru akan muncul disini.
        </Text>
        <Buttons
          title="Muat Ulang"
          onPress={onRefresh}
          className="mt-4 p-3 bg-blue-500 rounded-lg"
        />
      </View>
    );
  }

  // Helper for single item
  const renderOrderItem = ({ item }: { item: Order }) => {
    const statusStyle = getStatusColor(item.status);
    return (
      <Pressable
        className="p-4 mx-3 my-2 bg-white rounded-lg shadow-md border border-gray-100"
        onPress={() => router.push(`/dashboard/(user)/order-detail/${item.id}`)}
      >
        <Text className="text-md font-bold mb-1">
          Order #
          <Text className="font-normal">
            {item.id.substring(0, 8).toUpperCase()}
          </Text>
        </Text>
        <Text className="text-lg font-bold mb-1">{item.buyerName}</Text>
        <Text className="text-sm text-gray-700">
          Total : Rp{item.totalAmount.toLocaleString("id-ID")}
        </Text>
        <Text
          className={`mt-2 font-extrabold text-sm ${getStatusColor(item.status)}`}
        >
          Status: {statusStyle.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={renderOrderItem}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor="#f97316"
        />
      }
      ListHeaderComponent={() => (
        <Text className="text-2xl font-bold p-4 pb-2">
          Daftar Pesanan ({orders.length})
        </Text>
      )}
    />
  );
};

export default orderList;
