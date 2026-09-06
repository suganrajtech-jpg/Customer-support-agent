export type OrderStatus = "Shipped" | "Processing" | "Delivered";

export type Order = {
  id: string;
  productId: string;
  productName: string;
  price: number;
  status: OrderStatus;
  expectedDelivery: string;
  returnEligible: boolean;
};

export const orders: Order[] = [
  {
    id: "1024",
    productId: "soundmax-pro",
    productName: "Wireless Headphones",
    price: 79,
    status: "Shipped",
    expectedDelivery: "September 8, 2026",
    returnEligible: true,
  },
  {
    id: "1025",
    productId: "smartfit-watch",
    productName: "SmartFit Watch",
    price: 129,
    status: "Processing",
    expectedDelivery: "September 11, 2026",
    returnEligible: true,
  },
  {
    id: "1026",
    productId: "powercharge-20k",
    productName: "PowerCharge 20K",
    price: 49,
    status: "Delivered",
    expectedDelivery: "September 3, 2026",
    returnEligible: false,
  },
];