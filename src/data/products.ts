export type ProductCategory = "Headphones" | "Wearables" | "Accessories";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  rating: number;
  description: string;
  stock: string;
};

export const products: Product[] = [
  {
    id: "soundmax-pro",
    name: "SoundMax Pro",
    price: 79,
    category: "Headphones",
    rating: 4.8,
    description: "Wireless headphones with active noise cancellation.",
    stock: "In stock",
  },
  {
    id: "audiocore-x",
    name: "AudioCore X",
    price: 89,
    category: "Headphones",
    rating: 4.6,
    description: "Comfortable Bluetooth headphones for everyday use.",
    stock: "In stock",
  },
  {
    id: "basswave-500",
    name: "BassWave 500",
    price: 99,
    category: "Headphones",
    rating: 4.7,
    description: "Wireless headphones designed for strong, balanced bass.",
    stock: "Low stock",
  },
  {
    id: "smartfit-watch",
    name: "SmartFit Watch",
    price: 129,
    category: "Wearables",
    rating: 4.5,
    description: "A focused fitness watch with sleep and activity tracking.",
    stock: "In stock",
  },
  {
    id: "powercharge-20k",
    name: "PowerCharge 20K",
    price: 49,
    category: "Accessories",
    rating: 4.4,
    description: "A compact high-capacity power bank for busy days.",
    stock: "In stock",
  },
];