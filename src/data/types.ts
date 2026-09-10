export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images?: string[];
  badge?: string;
  isNew?: boolean;
  gender?: "women" | "men" | "kids" | "unisex";
  description: string;
  longDescription: string;
  colors: string[];
  sizes: string[];
  features: string[];
  stock: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
