import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

export interface Product {
  id: string;
  ownerUid: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  imageUrl?: string;
  createdAt: string;
}

const FIRESTORE_TIMEOUT_MS = 5000;

const withTimeout = <T>(promise: Promise<T>): Promise<T> => {
  const timeoutPromise = new Promise<T>((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error("TimeoutError: Firestore operation timed out"));
    }, FIRESTORE_TIMEOUT_MS);
  });
  return Promise.race([promise, timeoutPromise]);
};

/**
 * Maps a Firestore document snapshot to the Product interface.
 */
const mapDocToProduct = (doc: DocumentData): Product => {
  // We cast to Product and assert all required fields are present (as per rules)
  return {
    id: doc.id,
    ...doc.data(),
  } as Product;
};

/**
 * Sets up a real-time listener for products belonging to a specific seller.
 * @param ownerUid The UID of the currently logged-in seller.
 * @param callback A function to execute every time the product list changes.
 * @returns An unsubscribe function to stop the listener when the component unmounts.
 */
export const subscribeToSellerProducts = (
  ownerUid: string,
  callback: (products: Product[]) => void
) => {
  const productRef = collection(db, "products");

  const q = query(
    productRef,
    where("ownerUid", "==", ownerUid),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot: QuerySnapshot<DocumentData>) => {
      const products: Product[] = [];

      querySnapshot.forEach((doc) => {
        // products.push({
        //   id: doc.id,
        //   ...doc.data(),
        // } as Product);
        products.push(mapDocToProduct(doc) as Product);
      });
      callback(products);
    },
    (error) => {
      console.error("Error subscribing to seller products :", error);
    }
  );
  return unsubscribe;
};

/**
 *
 * Delete a product document from Firestore
 * @param productId The unique ID of the product document to delete
 */
export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const productRef = doc(db, "products", productId);

    // command to delete product
    await deleteDoc(productRef);
  } catch (error) {
    console.error("Error deleting product: ", error);
    throw new Error("Gagal menghapus produk. Coba lagi atau hubungi admin!");
  }
};

/**
 *
 * Creating a new product document to the Firestore
 * @param productData A product information gathered from the seller
 */
export const createProduct = async (
  productData: Omit<Product, "id" | "createdAt">
): Promise<string> => {
  try {
    const productsRef = collection(db, "products");
    const docRef = await withTimeout(
      addDoc(productsRef, {
        ...productData,
        createdAt: serverTimestamp(),
      })
    );
    return docRef.id;
  } catch (error: any) {
    // 💡 Check for the distinct TimeoutError message
    if (error.message.includes("TimeoutError")) {
      throw new Error(
        "Gagal menyimpan produk. Waktu koneksi habis. Silakan periksa jaringan Anda."
      );
    }
    // General network failure/other errors
    throw new Error(
      "Gagal menyimpan produk. Periksa koneksi internet anda dan coba kembali."
    );
  }
};

/**
 * Fetches a single product document by its ID.
 * @param productId The ID of the product document.
 * @returns A promise that resolves to the Product object or null if not found.
 */

export const getProductById = async (
  productId: string
): Promise<Product | null> => {
  try {
    const productRef = doc(db, "products", productId);
    const docSnap = await withTimeout(getDoc(productRef));

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Product;
    }
    return null;
  } catch (error) {
    console.error("Error fetching product by ID :", error);
    throw new Error("Gagal mengambil detail produk.");
  }
};

/**
 * Updates an existing product document in Firestore.
 * @param productId The ID of the product document to update.
 * @param updates A partial object containing the fields to modify.
 */

export const updateProduct = async (
  productId: string,
  updates: Partial<Omit<Product, "id" | "ownerUid">>
): Promise<void> => {
  try {
    const productRef = doc(db, "products", productId);

    await withTimeout(updateDoc(productRef, updates));
  } catch (error: any) {
    // 💡 Check for the distinct TimeoutError message
    if (error.message.includes("TimeoutError")) {
      throw new Error(
        "Gagal menyimpan produk. Waktu koneksi habis. Silakan periksa jaringan Anda."
      );
    }
    // General network failure/other errors
    throw new Error(
      "Gagal menyimpan produk. Periksa koneksi internet anda dan coba kembali."
    );
  }
};

export const getSellerProducts = async (
  ownerUid: string
): Promise<Product[]> => {
  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("ownerUid", "==", ownerUid));
    const querySnapshot: QuerySnapshot<DocumentData> = await withTimeout(
      getDocs(q)
    );
    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      // products.push({
      //   id: doc.id,
      //   ...doc.data(),
      // } as Product);
      products.push(mapDocToProduct(doc) as Product);
    });
    return products;
  } catch (error: any) {
    // 💡 Check for the distinct TimeoutError message
    if (error.message.includes("TimeoutError")) {
      throw new Error(
        "Gagal mengambil daftar produk. Waktu koneksi habis. Silakan periksa jaringan Anda."
      );
    }
    // General network failure/other errors
    throw new Error(
      "Gagal mengambil daftar produk. Periksa koneksi internet anda dan coba kembali."
    );
  }
};

export const countTotalProducts = async (ownerUid: string): Promise<number> => {
  const productsRef = collection(db, "products");
  const q = query(productsRef, where("ownerUid", "==", ownerUid));
  const querySnapshot = await withTimeout(getDocs(q));
  return querySnapshot.size;
};
