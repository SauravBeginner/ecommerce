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

type AuthContextValue = {
  user: User | null;
  addresses: Address[];
  signIn: (email: string) => void;
  signUp: (name: string, email: string, marketingOptIn: boolean) => void;
  signOut: () => void;
  updateProfile: (patch: Partial<User>) => void;
  saveAddress: (address: Omit<Address, "id"> & { id?: string }) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const USER_KEY = "northstar-user";
const ADDRESS_KEY = "northstar-addresses";

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
    .join(" ") || "Northstar member";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => read<User | null>(USER_KEY, null));
  const [addresses, setAddresses] = useState<Address[]>(() => read<Address[]>(ADDRESS_KEY, []));

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

  const setDefaultAddress = (id: string) =>
    setAddresses((current) => current.map((item) => ({ ...item, isDefault: item.id === id })));

  return (
    <AuthContext.Provider
      value={{ user, addresses, signIn, signUp, signOut, updateProfile, saveAddress, removeAddress, setDefaultAddress }}
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
