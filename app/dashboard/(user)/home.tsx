import Buttons from "@/components/ui/Buttons";
import { useAuth } from "@/context/AuthContext";
import { calculateTotalRevenue, countOrderByStatus } from "@/lib/orderService";
import { countTotalProducts } from "@/lib/productService";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

interface Metrics {
  totalProducts: number | null;
  pendingOrders: number | null;
  processingOrders: number | null;
  totalRevenue: number | null;
}

const home = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<Metrics>({
    totalProducts: null,
    pendingOrders: null,
    processingOrders: null,
    totalRevenue: null,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (showLoading = true) => {
    if (!user) return;

    if (showLoading) setLoading(true);
    setRefreshing(true);

    try {
      const [pending, processing, revenue, productData] = await Promise.all([
        countOrderByStatus(user.uid, "pending"),
        countOrderByStatus(user.uid, "processing"),
        calculateTotalRevenue(user.uid),
        countTotalProducts(user.uid),
      ]);
      setMetrics({
        totalProducts: productData,
        pendingOrders: pending,
        processingOrders: processing,
        totalRevenue: revenue,
      });
    } catch (error) {
      console.error("Failed to load dashboard metrics: ", error);
      Alert.alert("Gagal Memuat", "Gagal memuat data metrik. Coba muat ulang.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleRefresh = () => {
    fetchData(false);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="mt-2 text-gray-600">Memuat data...</Text>
      </View>
    );
  }
  const renderMetricCard = (
    title: string,
    value: number | null,
    colorClass: string,
    navPath?: string
  ) => (
    <Buttons
      title={title}
      onPress={() => navPath && router.push(navPath as any)}
      className={`w-full p-4 mb-4 rounded-lg shadow-md ${colorClass}`}
      disabled={!navPath}
    >
      <Text className="text-white text-3xl font-bold mt-1">
        {value === null
          ? "--"
          : title.includes("Revenue")
            ? `Rp ${value.toLocaleString("id-ID")}`
            : value}
      </Text>
      {navPath && (
        <Text className="text-white text-xs mt-2 underline opacity-70">
          Lihat Detail
        </Text>
      )}
    </Buttons>
  );

  return (
    <ScrollView
      className="flex-1 p-4 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <Text className="text-3xl font-bold mb-6 text-gray-800 mt-10">
        Dashboard Toko
      </Text>
      {/* Sales / Orders Metrics */}
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-3">Kinerja Penjualan</Text>
        {renderMetricCard(
          "Total Pendapatan (Terkirim)",
          metrics.totalRevenue,
          "bg-green-600"
        )}
        {renderMetricCard(
          "Pesanan Diproses",
          metrics.processingOrders,
          "bg-yellow-600",
          "/dashboard/(user)/order-list"
        )}
        {renderMetricCard(
          "Menunggu Pembayaran",
          metrics.pendingOrders,
          "bg-red-600",
          "/dashboard/(user)/order-list"
        )}
      </View>
      {/* Inventory Metrics */}
      <View>
        <Text>Kelola Produk</Text>
        {renderMetricCard(
          "Total Produk",
          metrics.totalProducts,
          "bg-blue-600",
          "/dashboard/(user)/products"
        )}
      </View>
      <View className="h-20" />
    </ScrollView>
  );
};
export default home;
