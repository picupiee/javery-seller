import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  sellerUid: string;
  buyerName: string;
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
}

/**
 * Sets up a real-time listener for orders belonging to a specific seller (sellerUid).
 * @param sellerUid The UID of the currently logged-in seller.
 * @param callback A function to execute every time the order list changes.
 * @returns An unsubscribe function to stop the listener.
 */

export const subscribeToSellerOrders = (
  sellerUid: string,
  callback: (orders: Order[]) => void,
  onError: (error: Error) => void
) => {
  const ordersRef = collection(db, "orders");
  const q = query(
    ordersRef,
    where("sellerUid", "==", sellerUid),
    orderBy("orderDate", "desc")
  );

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const orders: Order[] = [];

      querySnapshot.forEach((doc) => {
        orders.push({
          id: doc.id,
          ...doc.data(),
        } as Order);
      });
      callback(orders);
    },
    (error) => {
      onError(error as Error);
    }
  );
  return unsubscribe;
};

/**
 * Updates the status of a specific order document.
 * @param orderId The ID of the order document to update.
 * @param newStatus The new status to apply ('processing', 'shipped', etc.).
 */

export const updateOrderStatus = async (
  orderId: string,
  newStatus: OrderStatus
): Promise<void> => {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating order status: ", error);
    throw new Error("Gagal memperbarui status pesanan. Coba lagi.");
  }
};

/**
 * You will also need a function to get a single order by ID for the detail screen.
 * This is similar to getProductById.
 */
export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    const orderRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(orderRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Order;
    }
    return null;
  } catch (error) {
    console.error("Error fetching order by ID: ", error);
    throw new Error("Gagal mengambil detail pesanan");
  }
};

/**
 * Fetches the count of orders matching a specific status for a seller.
 * @param sellerUid The UID of the seller.
 * @param status The status to count ('pending', 'processing', etc.).
 * @returns A promise that resolves to the number of orders found.
 */

export const countOrderByStatus = async (
  sellerUid: string,
  status: string
): Promise<number> => {
  try {
    const ordersRef = collection(db, "orders");

    const q = query(
      ordersRef,
      where("sellerUid", "==", sellerUid),
      where("status", "==", status)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (err) {
    console.error(`Error counting orders with status ${status}:`, { err });
    throw new Error("Gagal menghitung pesanan.");
  }
};

/**
 * Calculates the total revenue from delivered orders for a seller.
 * NOTE: This requires fetching all 'delivered' documents and manually summing.
 * For production scale, consider using Firebase Cloud Functions for aggregation.
 * @param sellerUid The UID of the seller.
 * @returns A promise that resolves to the total revenue.
 */

export const calculateTotalRevenue = async (
  sellerUid: string
): Promise<number> => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("sellerUid", "==", sellerUid),
      where("status", "==", "delivered")
    );
    const querySnapshot = await getDocs(q);
    let total = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (typeof data.totalAmount === "number") {
        total += data.totalAmount;
      }
    });
    return total;
  } catch (error) {
    console.error("Error calculating total revenue: ", error);
    throw new Error("Gagal menghitung total pendapatan.");
  }
};
