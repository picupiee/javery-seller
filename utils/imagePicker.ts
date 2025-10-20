import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

const getFilenameFromUri = (uri: string): string => {
  if (!uri) return "";
  const lastSlashIndex = uri.lastIndexOf("/");
  return lastSlashIndex !== -1 ? uri.substring(lastSlashIndex + 1) : uri;
};

/**
 * Handles image selection and optimization using Expo utilities.
 * @returns {Promise<string | null>} The local URI of the manipulated image, or null if canceled/failed.
 */

export const selectAndManipulateImage = async (): Promise<{
  uri: string;
  filename: string;
} | null> => {
  const source = await new Promise<"gallery" | "camera" | null>((resolve) => {
    Alert.alert(
      "Pilih Sumber Gambar",
      "",
      [
        {
          text: "Galeri Foto",
          onPress: () => resolve("gallery"),
        },
        {
          text: "Kamera",
          onPress: () => resolve("camera"),
        },
        {
          text: "Batal",
          style: "cancel",
          onPress: () => resolve(null),
        },
      ],
      { cancelable: true }
    );
  });

  if (!source) return null;
  let finalResult: ImagePicker.ImagePickerResult | null = null;
  const options = {
    allowsEditing: true,
    quality: 1,
    mediaTypes: ["images"], // Use constant for safety
  };

  if (source === "gallery") {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Izin akses galeri diperlukan!");
      return null;
    }
    finalResult = await ImagePicker.launchImageLibraryAsync({
      ...options,
      mediaTypes: ["images"],
      quality: 1,
      allowsEditing: true,
    });
  } else if (source === "camera") {
    // ⚠️ Request Camera Permissions
    let cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    let mediaLibraryPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync(); // Camera also needs Media Library on Android/iOS to save the photo

    if (!cameraPermission.granted || !mediaLibraryPermission.granted) {
      Alert.alert("Izin kamera dan galeri diperlukan untuk mengambil foto.");
      return null;
    }
    finalResult = await ImagePicker.launchCameraAsync({
      ...options,
      mediaTypes: ["images"],
      quality: 1,
      allowsEditing: true,
      cameraType: ImagePicker.CameraType.back,
    });
  }
  if (
    !finalResult ||
    finalResult.canceled ||
    !finalResult.assets ||
    finalResult.assets.length === 0
  ) {
    return null; // User canceled the picker/camera
  }

  const selectedImage = finalResult.assets[0].uri;
  const filename = getFilenameFromUri(selectedImage);

  try {
    const imageContext = ImageManipulator.ImageManipulator.manipulate(
      selectedImage
    ).resize({ width: 1000 });
    const renderImage = await imageContext.renderAsync();

    const result = await renderImage.saveAsync({
      compress: 0.7,
      format: ImageManipulator.SaveFormat.JPEG,
    });

    return {
      uri: result.uri,
      filename: filename,
    };
  } catch (e) {
    console.error("Error manipulating image: ", e);
    Alert.alert("Gagal memproses gambar. Silahkan coba kembali.");
    return null;
  }
};
