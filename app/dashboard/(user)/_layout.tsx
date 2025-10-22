import useUpdates from "@/hooks/useUpdate";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function RootLayout() {
  const { updateStatus, error, checkForUpdates } = useUpdates();

  const renderUpdateStatus = () => {
    switch (updateStatus) {
      case "checking":
        return (
          <Text className="text-xs text-blue-500 text-center bg-blue-500 py-1">
            Memerika Update Terbaru...
          </Text>
        );
      case "downloading":
        return (
          <Text className="text-xs text-orange-500 text-center bg-orange-50 py-1">
            Mendownload Update...
          </Text>
        );
      case "ready":
        return (
          <Text className="text-xs text-green-600 text-center bg-green-50 py-1 font-bold">
            Update Tersedia !
          </Text>
        );
      case "error":
        return (
          <Text
            className="text-xs text-red-600 text-center bg-red-50 py-1"
            onPress={checkForUpdates} // Calls the function to retry
          >
            Error pembaruan. Ketuk untuk coba lagi.
          </Text>
        );
      default:
        return null;
    }
  };
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#f97316",
        tabBarInactiveTintColor: "#4b5563",
        animation: "shift",
        sceneStyle: {
          backgroundColor: "white",
          marginTop: 30,
        },
      }}
    >
      {renderUpdateStatus()}
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="order-list"
        options={{
          title: "Daftar Pesanan",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: "Daftar Produk",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Akun",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-product"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="edit-product/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="order-detail/[id]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
