import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="order-list" options={{ title: "Daftar Pesanan" }} />
      <Tabs.Screen name="products" options={{ title: "Daftar Produk" }} />
      <Tabs.Screen name="account" options={{ title: "Akun" }} />
    </Tabs>
  );
}
