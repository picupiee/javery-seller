// Replace these with your actual Cloudinary credentials
const CLOUDINARY_CLOUD_NAME =
  process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || "dazl8oipc";
const CLOUDINARY_UPLOAD_PRESET = "javery_products-";

const CLOUDINARY_TIMEOUT_MS = 60000;

/**
 * Uploads a local file URI (from expo-image-picker/manipulator) directly to Cloudinary.
 * @param {string} uri - The local file path (e.g., file:///...) of the image to upload.
 * @param {string} ownerUid - The unique ID of the product owner (Firebase UID)
 * @returns {Promise<string>} - The secure CDN URL of the uploaded image.
 */
export const uploadImageToCloudinary = async (
  uri: string,
  ownerUid: string
): Promise<string> => {
  if (!uri || !ownerUid) {
    if (ownerUid === "") {
      console.error("Cloudinary Upload Error: ownerUid is an empty string.");
      throw new Error("Cannot upload image: owner ID is empty.");
    }
    console.error("Image URI or Owner ID is missing. :", { uri, ownerUid });
  }

  const BASE_FOLDER = "javery";
  const timestamp = Date.now();
  const fullPublicId = `${BASE_FOLDER}/${ownerUid}/javery_products-${timestamp}`;

  // The Cloudinary API endpoint for uploads
  const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  // 1. Create a FormData object
  const formData = new FormData();

  // Append the file data
  formData.append("file", {
    uri: uri,
    // Ensure the type matches the manipulated format (e.g., JPEG or PNG)
    type: "image/jpeg",
    name: "product_image.jpg",
  } as any); // Use 'as any' if TypeScript complains about the 'uri' type on React Native/Expo

  // Append the unsigned preset name
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("public_id", fullPublicId);
  // Appen the dynamic folder path
  //   formData.append("folder", dynamicFolder);

  const controller = new AbortController();
  const signal = controller.signal;

  const timeoutId = setTimeout(() => controller.abort(), CLOUDINARY_TIMEOUT_MS);

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
      signal: signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (data.error) {
      // Log the detailed error from Cloudinary
      console.error("Cloudinary API Error:", data.error);
      throw new Error(`Cloudinary Upload Failed: ${data.error.message}`);
    }

    // Return the final CDN URL
    console.log(data.secure_url);
    return data.secure_url;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Network or Cloudinary Upload Error:", error);
    // Re-throw a generic error for the calling component
    throw new Error("Failed to upload image. Check network connection.");
  }
};
