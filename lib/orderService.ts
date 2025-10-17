import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

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
  callback: (orders: Order[]) => void
) => {
  const ordersRef = collection(db, "orders");
  const q = query(
    ordersRef,
    where("sellerUid", "==", sellerUid),
    orderBy("orderDate", "desc")
  );

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const orders: Order[] = [];

    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data(),
      } as Order);
    });
    callback(orders);
  });
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
    // const orderRef = doc(db, "orders", orderId);
    // const docSnap = await getDoc(orderRef);

    // if(docSnap.exists()) {
    //     return {
    //         id: docSnap.id,
    //         ...docSnap.data(),
    //     } as Order
    // }
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
