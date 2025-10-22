import useUpdates from "@/hooks/useUpdate";
import { Ionicons } from "@expo/vector-icons";
import { Link, Tabs } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const { isUpdateAvailable } = useUpdates();
  const renderUpdateBanner = () => {
    if (!isUpdateAvailable) return null;
    return (
      <Link href="/dashboard/(user)/account" asChild>
        <View className="bg-yellow-500 py-1 px-4 items-center">
          <Text className="text-sm text-white font-semibold text-center">
            Pembaruan Tersedia! Ketuk untuk menginstal.
          </Text>
        </View>
      </Link>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {renderUpdateBanner()}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#f97316",
          tabBarInactiveTintColor: "#4b5563",
          animation: "shift",
          sceneStyle: {
            marginTop: 0,
          },
        }}
      >
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
              <Ionicons
                name="person-circle-outline"
                color={color}
                size={size}
              />
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
    </SafeAreaView>
  );
}
