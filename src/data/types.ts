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
  badge?: string;
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
