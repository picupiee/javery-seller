import {
  collection,
  DocumentData,
  getDocs,
  query,
  QuerySnapshot,
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
 * Fetches all products belonging to a specific seller (ownerUid)
 * @param ownerUid The UID of the currently logged-in seller.
 * @returns A promise that resolve to an array of Product objects.
 */

export const getSellerProducs = async (
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
