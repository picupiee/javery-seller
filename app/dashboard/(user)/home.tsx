import { useAuth } from "@/context/AuthContext";
import { calculateTotalRevenue, countOrderByStatus } from "@/lib/orderService";
import { countTotalProducts } from "@/lib/productService";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
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
  const storeName = user?.profile?.storeName || "Toko Anda";

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const updateGreeting = () => {
      const now = new Date();
      const hours = now.getHours();

      if (hours < 12) {
        setGreeting(`Selamat Pagi, ${storeName}`);
      } else if (hours >= 12 && hours < 14) {
        setGreeting(`Selamat Siang, ${storeName}`);
      } else if (hours >= 14 && hours < 18) {
        setGreeting(`Selamat Sore, ${storeName}`);
      } else {
        setGreeting(`Selamat Malam, ${storeName}`);
      }
    };
    updateGreeting();
    const intervalId = setInterval(updateGreeting, 60000);
    return () => clearInterval(intervalId);
  }, [storeName]);

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
    <Pressable
      onPress={() => navPath && router.push(navPath as any)}
      className={`w-full p-4 mb-4 rounded-lg shadow-md ${colorClass}`}
      disabled={!navPath}
    >
      <Text className="text-white text-sm opacity-80">{title}</Text>
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
    </Pressable>
  );

  return (
    <ScrollView
      className="flex-1 p-4 bg-gray-50"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <Text className="text-3xl font-bold mb-6 text-gray-800">{greeting}</Text>
      {/* Sales / Orders Metrics */}
      <View className="mb-6">
        <Text className="text-md font-semibold mb-3 border-b-2 pb-1">
          Kinerja Penjualan
        </Text>
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
        <Text className="text-md mb-2">Kelola Produk</Text>
        {renderMetricCard(
          "Total Produk",
          metrics.totalProducts,
          "bg-blue-600",
          "/dashboard/(user)/products"
        )}
      </View>
      <View className="mt-3 border-t-4 border-gray-300 pt-2">
        <Text className="text-3xl font-semibold">Berita Javery</Text>
        <Text className="mt-10 text-xl font-semibold text-gray-400 text-center">
          Segera Hadir
        </Text>
      </View>
      <View className="h-20" />
    </ScrollView>
  );
};
export default home;
