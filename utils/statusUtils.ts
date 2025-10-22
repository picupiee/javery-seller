import { OrderStatus } from "./orderService";

interface StatusStyle {
  text: string;
  bg: string;
  label: string;
}

/**
 * Return consistents Tailwind CSS classes and a display label for a given OrderStatus.
 * @param status The current status of the order.
 * @returns A StatusStyle object containing text color, background color, and label.
 */
export const getStatusStyle = (status: OrderStatus): StatusStyle => {
  switch (status) {
    case "pending":
      return { text: "text-red-700", bg: "bg-red-100", label: "MENUNGGU" };
    case "processing":
      return {
        text: "text-yellow-700",
        bg: "bg-yellow-100",
        label: "DIPROSES",
      };
    case "shipped":
      return { text: "text-blue-700", bg: "bg-blue-100", label: "DIKIRIM" };
    case "delivered":
      return { text: "text-green-700", bg: "bg-green-100", label: "SELESAI" };
    case "cancelled":
      return { text: "text-red-700", bg: "bg-red-100", label: "DIBATALKAN" };
    default:
      return { text: "text-gray-700", bg: "bg-gray-100", label: "N/A" };
  }
};
