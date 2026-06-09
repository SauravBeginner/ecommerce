import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/sections/header";
import { useStorefront } from "@/store/storefront";

type Theme = "light" | "dark";

export function AppLayout() {
  const { cartItems, wishlistIds, message } = useStorefront();
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = window.localStorage.getItem("northstar-theme");
    return savedTheme === "dark" ? "dark" : "light";
  });
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("northstar-theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistIds.length}
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
      />
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-border/60 py-6">
        <div className="container flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>Northstar Commerce</p>
          {message ? (
            <p className="flex items-center gap-2 text-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              {message}
            </p>
          ) : (
            <p>Premium essentials for everyday routines.</p>
          )}
        </div>
      </footer>
    </div>
  );
}
