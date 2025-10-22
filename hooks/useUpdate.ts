import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
// ⚠️ Ensure this path correctly points to your expo-updates package
import * as Updates from 'expo-updates'; 

const useUpdates = () => {
  const [updateStatus, setUpdateStatus] = useState<'checking' | 'available' | 'downloading' | 'ready' | 'error' | 'idle'>('idle');
  const [error, setError] = useState<string | null>(null);

  const checkForUpdates = async () => {
    // 1. Check if updates are enabled (crucial for development clients)
    if (!Updates.isEnabled) {
      console.log('Expo Updates is not enabled (running in Expo Go or development mode).');
      return; 
    }

    try {
      setUpdateStatus('checking');
      setError(null); // Clear previous errors

      // 2. Check the server for a new update
      const updateCheckResult = await Updates.checkForUpdateAsync();

      if (updateCheckResult.isAvailable) {
        setUpdateStatus('downloading');
        
        // 3. Download the new bundle
        const updateFetchResult = await Updates.fetchUpdateAsync(); 

        if (updateFetchResult.isNew) {
            setUpdateStatus('ready');
            // 4. Prompt the user to apply the update immediately
            Alert.alert(
              "Pembaruan Tersedia",
              "Versi baru aplikasi sudah siap. Muat ulang sekarang untuk menginstal?",
              [
                {
                  text: "Muat Ulang Sekarang (Reload)",
                  onPress: () => {
                    // 5. Reload the app with the new bundle
                    Updates.reloadAsync(); 
                  },
                },
                {
                  text: "Nanti",
                  style: 'cancel',
                  onPress: () => setUpdateStatus('idle'), 
                },
              ]
            );
        } else {
            // This case handles a scenario where updateCheckResult.isAvailable was true, 
            // but fetchUpdateAsync determines no new code was needed (e.g., already downloaded)
            setUpdateStatus('idle'); 
        }

      } else {
        setUpdateStatus('idle'); // No update available
      }
    } catch (e: any) {
      console.error('Error fetching updates:', e);
      setError("Gagal memeriksa pembaruan. Silakan periksa koneksi internet Anda.");
      setUpdateStatus('error');
    }
  };

  // Run the check once when the component mounts
  useEffect(() => {
    checkForUpdates();
    // No need for addListener as you provided: it is deprecated in the new API.
    // We rely on the initial check and the user's interaction (or next cold start).
  }, []);

  return { updateStatus, error, checkForUpdates };
};

export default useUpdates;