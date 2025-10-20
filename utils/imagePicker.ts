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
  let permissionResult =
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  await ImagePicker.requestCameraPermissionsAsync();
  if (!permissionResult.granted) {
    Alert.alert("Izin akses galeri diperlukan!");
    return null;
  }

  let pickerResult = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    quality: 1,
    aspect: [4, 3],
  });

  if (
    pickerResult.canceled ||
    !pickerResult.assets ||
    pickerResult.assets.length === 0
  ) {
    return null;
  }

  const selectedImage = pickerResult.assets[0].uri;
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
