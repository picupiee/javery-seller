import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  serverTimestamp,
  updateDoc,
  where,
  getDoc
} from "firebase/firestore";
import { db } from "./firebase";

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
        products.push({
          id: doc.id,
          ...doc.data(),
        } as Product);
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
    const docRef = await addDoc(productsRef, {
      ...productData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating product: ", error);
    throw new Error("Gagal menyimpan produk baru. Silahkan coba lagi.");
  }
};

/**
 * Fetches a single product document by its ID.
 * @param productId The ID of the product document.
 * @returns A promise that resolves to the Product object or null if not found.
 */

export const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const productRef = doc(db, "products", productId)
    const docSnap = await getDoc(productRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Product;
    }
    return null;
  } catch (error) {
    console.error("Error fetching product by ID :", error)
    throw new Error("Gagal mengambil detail produk.")
  }
}

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

    await updateDoc(productRef, updates);
  } catch (error) {
    console.error("Error updating product : ", error, productId);
    throw new Error("Gagal memperbarui produk. Silahkan coba kembali.");
  }
};

export const getSellerProducts = async (
  ownerUid: string
): Promise<Product[]> => {
  try {
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("ownerUid", "==", ownerUid));
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      } as Product);
    });
    return products;
  } catch (error) {
    console.error("Error fetching seller products: ", error);
    throw new Error("Gagal mengambil daftar produk. Silahkan coba kembali.  ");
  }
};
