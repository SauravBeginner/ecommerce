import { useEffect, useState } from "react";
import { Heart, Menu, Moon, Search, ShoppingBag, Sun, UserRound, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/auth";
import { SearchPanel } from "@/components/store/search-panel";

type HeaderProps = {
  cartCount: number;
  wishlistCount: number;
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

const navItems = [
  { label: "Home", to: "/", end: true },
  { label: "Shop", to: "/shop", end: true },
  { label: "New in", to: "/shop?new=true" },
  { label: "Sale", to: "/shop?sale=true", accent: true },
];

function CountBubble({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-brand-foreground">
      {count}
    </span>
  );
}

export function Header({ cartCount, wishlistCount, theme, onToggleTheme }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const initials = user ? user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() : "";
  const currentPath = `${location.pathname}${location.search}`;

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [location]);

  const isActive = (item: (typeof navItems)[number]) =>
    item.end ? location.pathname === item.to && !location.search : currentPath === item.to;

  const iconButton =
    "relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-accent/70";

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="container flex h-[68px] items-center justify-between gap-6">
        {/* Wordmark */}
        <Link to="/" className="flex items-baseline gap-0.5 font-display text-2xl tracking-tight text-foreground">
          Northstar
          <span className="text-brand">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={cn(
                  "relative py-1 text-sm font-medium transition-colors hover:text-foreground",
                  active ? "text-foreground" : "text-muted-foreground",
                  item.accent && "text-brand hover:text-brand",
                  "after:absolute after:-bottom-0.5 after:left-0 after:h-px after:bg-brand after:transition-all after:duration-300",
                  active ? "after:w-full" : "after:w-0 hover:after:w-full",
                )}
              >
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button type="button" className={iconButton} aria-label="Search products" onClick={() => setSearchOpen(true)}>
            <Search className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </button>
          <button
            type="button"
            className={iconButton}
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="h-[18px] w-[18px]" strokeWidth={1.8} /> : <Moon className="h-[18px] w-[18px]" strokeWidth={1.8} />}
          </button>
          <Link to="/wishlist" className={iconButton} aria-label="Wishlist">
            <Heart className="h-[18px] w-[18px]" strokeWidth={1.8} />
            <CountBubble count={wishlistCount} />
          </Link>
          <Link to="/cart" className={iconButton} aria-label="Shopping cart">
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.8} />
            <CountBubble count={cartCount} />
          </Link>
          {user ? (
            <Link
              to="/account"
              aria-label="My account"
              className="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-foreground shadow-soft transition hover:scale-105"
            >
              {initials}
            </Link>
          ) : (
            <Button asChild size="sm" className="ml-2 hidden rounded-full px-5 md:inline-flex">
              <Link to="/login">
                <UserRound className="h-4 w-4" strokeWidth={2} />
                Sign in
              </Link>
            </Button>
          )}
          <button
            type="button"
            className={cn(iconButton, "md:hidden")}
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "grid overflow-hidden border-t border-border/70 transition-[grid-template-rows] duration-300 md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr] border-t-0",
        )}
      >
        <div className="min-h-0">
          <nav className="container flex flex-col py-3">
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={cn(
                  "flex items-center justify-between border-b border-border/60 py-3 font-display text-xl last:border-b-0",
                  item.accent ? "text-brand" : "text-foreground",
                )}
              >
                {item.label}
                <span className="text-sm text-muted-foreground">→</span>
              </NavLink>
            ))}
            <Button asChild className="mt-3 rounded-full">
              <Link to="/shop">Shop now</Link>
            </Button>
            <Button asChild variant="outline" className="mt-2 rounded-full">
              <Link to={user ? "/account" : "/login"}>{user ? "My account" : "Sign in / Create account"}</Link>
            </Button>
          </nav>
        </div>
      </div>
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
