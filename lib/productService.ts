import {
  addDoc,
  collection,
  DocumentData,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  serverTimestamp,
  where,
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
