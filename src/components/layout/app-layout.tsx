import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Footer } from "@/components/layout/footer";
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
      {/* Announcement bar — scrolls away, not sticky */}
      <div className="bg-primary px-4 py-2 text-center text-xs font-medium text-primary-foreground">
        Free shipping on all orders above $120 · Use code{" "}
        <span className="font-bold tracking-wide">NORTHSTAR10</span> for 10% off{" "}
        <Link to="/shop" className="ml-1 font-bold underline underline-offset-2 hover:opacity-80">
          Shop now →
        </Link>
      </div>
      <Header
        cartCount={cartCount}
        wishlistCount={wishlistIds.length}
        theme={theme}
        onToggleTheme={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
      />
      <main>
        <Outlet />
      </main>
      <Footer message={message} />
    </div>
  );
}
