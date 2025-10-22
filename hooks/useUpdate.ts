import { useEffect, useState } from "react";
import { Alert } from "react-native";
// ⚠️ Ensure this path correctly points to your expo-updates package
import * as Updates from "expo-updates";

const useUpdates = () => {
  // We only need a simple boolean to inform the UI
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  // We keep updateStatus for the Account page to track the manual process
  const [updateStatus, setUpdateStatus] = useState<
    "checking" | "downloading" | "ready" | "error" | "idle"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  // 1. Passive Check: Only checks, sets a boolean, and DOES NOT download or prompt
  const passiveCheckForUpdates = async () => {
    if (!Updates.isEnabled) return;
    try {
      const update = await Updates.checkForUpdateAsync();
      setIsUpdateAvailable(update.isAvailable); // Set the flag
    } catch (e) {
      // Log error but don't notify the user with a popup on the main screen
      console.error("Passive update check failed:", e);
    }
  };

  // 2. Active Check: Used on the Account page (kept from before)
  const activeCheckAndApplyUpdate = async () => {
    if (!Updates.isEnabled) return;
    setUpdateStatus("checking");
    setError(null);

    try {
      const updateCheckResult = await Updates.checkForUpdateAsync();

      if (updateCheckResult.isAvailable) {
        setUpdateStatus("downloading");
        await Updates.fetchUpdateAsync(); // Downloads the update

        setUpdateStatus("ready");

        // Prompt user ONLY after successful download
        Alert.alert(
          "Pembaruan Siap",
          "Pembaruan telah diunduh. Muat ulang sekarang untuk menginstal?",
          [
            { text: "Muat Ulang", onPress: () => Updates.reloadAsync() },
            { text: "Nanti", style: "cancel" },
          ]
        );
      } else {
        setUpdateStatus("idle");
        // This case is handled in the Account screen's handler (e.g., show a toast)
      }
    } catch (e: any) {
      setError("Gagal memeriksa/mengunduh pembaruan. Cek koneksi.");
      setUpdateStatus("error");
    }
  };

  useEffect(() => {
    passiveCheckForUpdates(); // Run the passive check on mount
  }, []);

  return {
    isUpdateAvailable,
    updateStatus,
    error,
    activeCheckAndApplyUpdate, // Return the active function for the Account page
  };
};

export default useUpdates;
