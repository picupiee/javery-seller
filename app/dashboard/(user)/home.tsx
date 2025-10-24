import { useAuth } from "@/context/AuthContext";
import { toggleStorePing } from "@/lib/storeService";
import {
  calculateTotalRevenue,
  countOrderByStatus,
} from "@/utils/orderService";
import { countTotalProducts } from "@/utils/productService";
import { showErrorToast, showSuccessToast } from "@/utils/toastUtils";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

interface Metrics {
  totalProducts: number | null;
  pendingOrders: number | null;
  processingOrders: number | null;
  totalRevenue: number | null;
}

const STATUS_COLORS_MAP = {
  pending: "bg-red-600",
  processing: "bg-yellow-600",
  revenue: "bg-green-600",
  products: "bg-orange-600",
};

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

  const [isPinging, setIsPinging] = useState(false);
  const [pingMessage, setPingMessage] = useState(
    "Buka dan Siap Melayani Pesanan !"
  );

  const handleTogglePing = async (newValue: boolean) => {
    if (!user) return;
    setIsPinging(newValue);

    try {
      await toggleStorePing(user.uid, newValue, pingMessage);
      showSuccessToast(
        newValue ? "Ping Diaktifkan" : "Ping Dinonaktifkan",
        newValue
          ? "Pembeli akan melihat promosi anda."
          : "Status toko anda tutup."
      );
    } catch (error) {
      setIsPinging(!newValue);
      showErrorToast("Gagal mengubah status ping");
      console.error("Ping error:", error);
    }
  };

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
      showErrorToast("Gagal Memuat Data Metrik. Silahkan coba lagi !");
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
    colorKey: string,
    navPath?: string
  ) => {
    const colorClass =
      STATUS_COLORS_MAP[colorKey as keyof typeof STATUS_COLORS_MAP] || colorKey;
    // const isOrderStatus = colorKey === "pending" || colorKey === "processing";
    const textColor = "text-white";

    return (
      <Pressable
        onPress={() => navPath && router.push(navPath as any)}
        className={`w-full p-4 mb-4 rounded-lg shadow-md ${colorClass}`}
        disabled={!navPath}
      >
        <Text className={`${textColor} text-sm opacity-80`}>{title}</Text>
        <Text className={`${textColor} text-3xl font-bold mt-1`}>
          {value === null
            ? "--"
            : title.includes("Pendapatan")
              ? `Rp ${value.toLocaleString("id-ID")}`
              : value}
        </Text>
        {navPath && (
          <Text className={`${textColor} text-xs mt-2 underline opacity-70`}>
            Lihat Detail
          </Text>
        )}
      </Pressable>
    );
  };

  return (
    <ScrollView
      className="flex-1 p-4 bg-white"
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
          "revenue"
        )}
        {renderMetricCard(
          "Pesanan Diproses",
          metrics.processingOrders,
          "processing",
          "/dashboard/(user)/order-list"
        )}
        {renderMetricCard(
          "Menunggu Pembayaran",
          metrics.pendingOrders,
          "pending",
          "/dashboard/(user)/order-list"
        )}
      </View>
      {/* Inventory Metrics */}
      <View>
        <Text className="text-md mb-2">Kelola Produk</Text>
        {renderMetricCard(
          "Total Produk",
          metrics.totalProducts,
          "products",
          "/dashboard/(user)/products"
        )}
      </View>
      {/* Ping Toggle */}
      <View className="mt-6 p-4 bg-white rounded-lg shadow-md border-t-2 border-orange-500">
        <Text className="text-lg font-semibold mb-2">Status Promosi Toko</Text>
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-md text-gray-700">Aktifkan Ping</Text>
          <Switch
            value={isPinging}
            onValueChange={handleTogglePing}
            trackColor={{ false: "#ccc", true: "#f97316" }}
          />
        </View>
        {isPinging && (
          <View className="mt-2">
            <Text className="text-sm text-gray-600 mb-1">
              Pesan Promosi Singkat:
            </Text>
            <TextInput
              value={pingMessage}
              onChangeText={setPingMessage}
              placeholder="Contoh: Silahkan order kue kami!"
              maxLength={80}
              className="border border-gray-800 p-2 rounded-lg"
            />
            <Text className="text-xs text-gray-500 mt-1 self-end">
              {pingMessage.length}/80
            </Text>
          </View>
        )}
      </View>
      {/* Javery mini Blog (Coming Soon) */}
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
