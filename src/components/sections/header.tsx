import { Heart, Menu, Moon, Search, ShoppingCart, Sparkles, Sun } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type HeaderProps = {
  cartCount: number;
  wishlistCount: number;
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

const navItems = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Wishlist", to: "/wishlist" },
  { label: "Cart", to: "/cart" },
];

export function Header({ cartCount, wishlistCount, theme, onToggleTheme }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/95 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-soft">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-extrabold">Northstar</p>
            <p className="text-xs text-muted-foreground">Premium essentials</p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-1 rounded-lg border border-border/80 bg-card p-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground",
                  isActive && "bg-foreground text-background hover:text-background",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden lg:inline-flex">
            Free shipping over $120
          </Badge>
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button asChild variant="ghost" size="icon">
            <NavLink to="/shop" aria-label="Search products">
              <Search className="h-5 w-5" />
            </NavLink>
          </Button>
          <Button asChild variant="ghost" size="icon">
            <NavLink to="/wishlist" aria-label="Wishlist">
              <div className="relative">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 ? (
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-bold text-background">
                    {wishlistCount}
                  </span>
                ) : null}
              </div>
            </NavLink>
          </Button>
          <Button asChild variant="outline" size="icon">
            <NavLink to="/cart" aria-label="Shopping cart">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 ? (
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                    {cartCount}
                  </span>
                ) : null}
              </div>
            </NavLink>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
