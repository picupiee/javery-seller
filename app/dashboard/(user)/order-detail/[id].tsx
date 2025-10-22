import Buttons from "@/components/ui/Buttons";
import { Order, OrderStatus, getOrderById } from "@/utils/orderService";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";

// Available status for the seller
const statusOptions: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
const statusLabels: Record<OrderStatus, string> = {
  pending: "Menunggu Pembayaran",
  processing: "Diproses Penjual",
  shipped: "Dikirim",
  delivered: "Selesai",
  cancelled: "Dibatalkan",
};
const getStatusColor = (status: OrderStatus) => {
  // Re-use logic from order-list.tsx
  switch (status) {
    case "pending":
      return "text-red-500";
    case "processing":
      return "text-yellow-600";
    case "shipped":
      return "text-blue-500";
    case "delivered":
      return "text-green-600";
    case "cancelled":
      return "text-gray-500";
    default:
      return "text-gray-800";
  }
};

const OrderDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("pending");

  // UI State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Load order data
  useEffect(() => {
    if (!id) {
      setError("Pesanan tidak ditemukan");
      setLoading(false);
      return;
    }

    const loadOrder = async () => {
      setLoading(true);
      try {
        const fetchedOrder = await getOrderById(id);

        if (fetchedOrder) {
          setOrder(fetchedOrder);
          setSelectedStatus(fetchedOrder.status);
        } else {
          setError("Pesanan tidak ditemukan");
        }
      } catch (err: any) {
        console.error("Load order error :", err);
        setError(err.message || "Gagal memuat detail pesanan");
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id]);

  // 2. Status Update Logic
  const handleUpdateStatus = async () => {
    if (!order || saving) return;

    setSaving(true);
    setError(null);

    try {
      Alert.alert(
        "Sukses",
        `Status pesanan berubah menjadi "${statusLabels[selectedStatus]}"`
      );
      router.replace("/dashboard/(user)/order-detail/[id]");
    } catch (err: any) {
      console.error("Failed to update order status :", err);
      Alert.alert("Gagal", err.message || "Gagal memperbarui status");
    } finally {
      setSaving(false);
    }
  };

  // 3. UI Rendering
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }
  if (error || !order) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-red-600 font-semibold text-lg">
          {error || "Data pesanan hilang!"}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-6 bg-white">
      <Text className="text-2xl font-bold mb-4">Detail Pesanan</Text>
      <Text className="text-lg text-gray-500 mb-6">
        ID : {order.id.substring(0, 10).toUpperCase()}
      </Text>

      {/* Buyer and Total */}
      <View className="bg-gray-100 p-4 rounded-lg mb-6">
        <Text className="text-md text-gray-700">
          Pembeli:{" "}
          <Text className="font-semibold text-gray-800">{order.buyerName}</Text>
        </Text>
        <Text className="text-md text-gray-700 mt-2">
          Tanggal: {new Date(order.orderDate).toLocaleDateString()}
        </Text>
        <Text className="text-xl font-extrabold text-orange-600 mt-4">
          Total: Rp {order.totalAmount.toLocaleString("id-ID")}
        </Text>
      </View>

      {/* Status update section */}
      <View className="mb-8">
        <Text className="text-lg font-bold mb-3">Ubah Status Pesanan</Text>

        <Text className="text-sm text-gray-500 mb-1">Status Saat Ini:</Text>
        <Text
          className={`text-xl font-bold mb-4 ${getStatusColor(order.status)}`}
        >
          {statusLabels[order.status]}
        </Text>

        <Text className="text-sm font-medium mb-1 text-gray-700">
          Pilih Status Baru:
        </Text>
        <View className="border border-gray-300 rounded-lg overflow-hidden">
          <Picker
            selectedValue={selectedStatus}
            onValueChange={(itemValue) =>
              setSelectedStatus(itemValue as OrderStatus)
            }
            // Prevent status update if the order is already final (delivered/cancelled)
            enabled={
              order.status !== "delivered" && order.status !== "cancelled"
            }
          >
            {statusOptions.map((status) => (
              <Picker.Item
                key={status}
                label={statusLabels[status]}
                value={status}
              />
            ))}
          </Picker>
        </View>
      </View>
      <Buttons
        title="Simpan Status Baru"
        onLoading="Menyimpan..."
        isLoading={saving}
        className={`p-3 rounded-lg shadow-md ${selectedStatus === order.status || saving ? "bg-gray-400" : "bg-blue-600"}`}
        textStyle="text-white text-center font-bold text-lg"
        onPress={handleUpdateStatus}
        // Disable if status hasn't changed or if it's already a final state
        disabled={
          selectedStatus === order.status ||
          saving ||
          order.status === "delivered" ||
          order.status === "cancelled"
        }
      />
      <View className="mt-8 h-20" />
    </ScrollView>
  );
};

export default OrderDetail;
