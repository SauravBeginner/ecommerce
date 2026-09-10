import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type User = {
  name: string;
  email: string;
  phone: string;
  marketingOptIn: boolean;
};

export type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export type PaymentMethod = {
  id: string;
  type: "card" | "upi";
  /** Cards: "Visa •••• 4242". UPI: the VPA itself. */
  label: string;
  brand?: string;
  last4?: string;
  expiry?: string;
  holder?: string;
  upiId?: string;
  isDefault: boolean;
};

export type OrderItem = {
  productId: number;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  placedAt: string;
  status: "Confirmed" | "Shipped" | "Delivered";
  items: OrderItem[];
  address: Address;
  delivery: { label: string; cost: number; eta: string };
  payment: { method: "card" | "upi" | "cod"; label: string };
  subtotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  total: number;
};

type AuthContextValue = {
  user: User | null;
  addresses: Address[];
  orders: Order[];
  placeOrder: (order: Omit<Order, "id" | "placedAt" | "status">) => Order;
  paymentMethods: PaymentMethod[];
  savePaymentMethod: (method: Omit<PaymentMethod, "id" | "isDefault"> & { isDefault?: boolean }) => void;
  updatePaymentMethod: (id: string, patch: Partial<Omit<PaymentMethod, "id">>) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  signIn: (email: string) => void;
  signUp: (name: string, email: string, marketingOptIn: boolean) => void;
  signOut: () => void;
  updateProfile: (patch: Partial<User>) => void;
  saveAddress: (address: Omit<Address, "id"> & { id?: string }) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const USER_KEY = "ecom-user";
const ADDRESS_KEY = "ecom-addresses";
const ORDERS_KEY = "ecom-orders";
const PAYMENTS_KEY = "ecom-payments";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function nameFromEmail(email: string) {
  const local = email.split("@")[0] ?? "";
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ") || "Ecom member";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => read<User | null>(USER_KEY, null));
  const [addresses, setAddresses] = useState<Address[]>(() => read<Address[]>(ADDRESS_KEY, []));
  const [orders, setOrders] = useState<Order[]>(() => read<Order[]>(ORDERS_KEY, []));
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => read<PaymentMethod[]>(PAYMENTS_KEY, []));

  useEffect(() => {
    try {
      window.localStorage.setItem(PAYMENTS_KEY, JSON.stringify(paymentMethods));
    } catch {
      /* storage unavailable */
    }
  }, [paymentMethods]);

  useEffect(() => {
    try {
      window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch {
      /* storage unavailable */
    }
  }, [orders]);

  useEffect(() => {
    try {
      if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
      else window.localStorage.removeItem(USER_KEY);
    } catch {
      /* storage unavailable */
    }
  }, [user]);

  useEffect(() => {
    try {
      window.localStorage.setItem(ADDRESS_KEY, JSON.stringify(addresses));
    } catch {
      /* storage unavailable */
    }
  }, [addresses]);

  const signIn = (email: string) => {
    setUser((current) =>
      current?.email === email
        ? current
        : { name: nameFromEmail(email), email, phone: "", marketingOptIn: false },
    );
  };

  const signUp = (name: string, email: string, marketingOptIn: boolean) => {
    setUser({ name: name.trim() || nameFromEmail(email), email, phone: "", marketingOptIn });
  };

  const signOut = () => setUser(null);

  const placeOrder = (draft: Omit<Order, "id" | "placedAt" | "status">) => {
    const order: Order = {
      ...draft,
      id: `EC-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      placedAt: new Date().toISOString(),
      status: "Confirmed",
    };
    setOrders((current) => [order, ...current]);
    return order;
  };

  const updateProfile = (patch: Partial<User>) =>
    setUser((current) => (current ? { ...current, ...patch } : current));

  const saveAddress = (address: Omit<Address, "id"> & { id?: string }) => {
    setAddresses((current) => {
      const id = address.id ?? `addr-${Date.now()}`;
      const makeDefault = address.isDefault || current.length === 0;
      const next = current
        .filter((item) => item.id !== id)
        .map((item) => (makeDefault ? { ...item, isDefault: false } : item));
      return [...next, { ...address, id, isDefault: makeDefault }];
    });
  };

  const removeAddress = (id: string) =>
    setAddresses((current) => {
      const next = current.filter((item) => item.id !== id);
      if (next.length > 0 && !next.some((item) => item.isDefault)) next[0] = { ...next[0], isDefault: true };
      return next;
    });

  const savePaymentMethod = (method: Omit<PaymentMethod, "id" | "isDefault"> & { isDefault?: boolean }) =>
    setPaymentMethods((current) => {
      const makeDefault = method.isDefault || current.length === 0;
      const next = current.map((item) => (makeDefault ? { ...item, isDefault: false } : item));
      return [...next, { ...method, id: `pm-${Date.now()}`, isDefault: makeDefault }];
    });

  const updatePaymentMethod = (id: string, patch: Partial<Omit<PaymentMethod, "id">>) =>
    setPaymentMethods((current) => {
      const next = current.map((item) => (item.id === id ? { ...item, ...patch } : item));
      return patch.isDefault ? next.map((item) => ({ ...item, isDefault: item.id === id })) : next;
    });

  const removePaymentMethod = (id: string) =>
    setPaymentMethods((current) => {
      const next = current.filter((item) => item.id !== id);
      if (next.length > 0 && !next.some((item) => item.isDefault)) next[0] = { ...next[0], isDefault: true };
      return next;
    });

  const setDefaultPaymentMethod = (id: string) =>
    setPaymentMethods((current) => current.map((item) => ({ ...item, isDefault: item.id === id })));

  const setDefaultAddress = (id: string) =>
    setAddresses((current) => current.map((item) => ({ ...item, isDefault: item.id === id })));

  return (
    <AuthContext.Provider
      value={{ user, addresses, orders, placeOrder, paymentMethods, savePaymentMethod, updatePaymentMethod, removePaymentMethod, setDefaultPaymentMethod, signIn, signUp, signOut, updateProfile, saveAddress, removeAddress, setDefaultAddress }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
