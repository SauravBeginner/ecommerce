import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product } from "@/data/types";
import { api } from "@/lib/api";

type StorefrontContextValue = {
  products: Product[];
  featuredProducts: Product[];
  cartItems: CartItem[];
  wishlistIds: number[];
  wishlistProducts: Product[];
  email: string;
  message: string;
  setEmail: (value: string) => void;
  submitNewsletter: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: number) => boolean;
};

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

export function StorefrontProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      const response = await api.get<Product[]>("products.json");
      if (mounted) {
        setProducts(response.data);
        setCartItems(response.data.slice(0, 2).map((product, index) => ({
          product,
          quantity: index === 0 ? 1 : 2,
        })));
      }
    }

    void loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const addToCart = (product: Product) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...current, { product, quantity: 1 }];
    });
    setMessage(`${product.name} added to cart`);
  };

  const removeFromCart = (productId: number) => {
    setCartItems((current) => current.filter((item) => item.product.id !== productId));
    setMessage("Item removed from cart");
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((current) =>
      current.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
    setMessage("Cart updated");
  };

  const toggleWishlist = (product: Product) => {
    setWishlistIds((current) => {
      const exists = current.includes(product.id);
      setMessage(exists ? `${product.name} removed from wishlist` : `${product.name} saved to wishlist`);
      return exists ? current.filter((id) => id !== product.id) : [...current, product.id];
    });
  };

  const isWishlisted = (productId: number) => wishlistIds.includes(productId);

  const submitNewsletter = () => {
    if (!email.trim()) {
      setMessage("Enter an email address to subscribe");
      return;
    }

    setMessage(`Subscribed with ${email}`);
    setEmail("");
  };

  const featuredProducts = products.slice(0, 4);
  const wishlistProducts = useMemo(
    () => products.filter((product) => wishlistIds.includes(product.id)),
    [products, wishlistIds],
  );

  return (
    <StorefrontContext.Provider
      value={{
        products,
        featuredProducts,
        cartItems,
        wishlistIds,
        wishlistProducts,
        email,
        message,
        setEmail,
        submitNewsletter,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </StorefrontContext.Provider>
  );
}

export function useStorefront() {
  const context = useContext(StorefrontContext);
  if (!context) {
    throw new Error("useStorefront must be used within StorefrontProvider");
  }
  return context;
}
