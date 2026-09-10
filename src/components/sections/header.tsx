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

type NavItem = { label: string; to: string; accent?: boolean; isActive: (path: string, params: URLSearchParams) => boolean };

const onShop = (path: string) => path === "/shop";

const navItems: NavItem[] = [
  { label: "Home", to: "/", isActive: (path) => path === "/" },
  // "Shop" is the catch-all: lit on any shop view that isn't claimed by a more specific link
  { label: "Shop", to: "/shop", isActive: (path, p) => onShop(path) && p.get("new") !== "true" && p.get("sale") !== "true" },
  { label: "New in", to: "/shop?new=true", isActive: (path, p) => onShop(path) && p.get("new") === "true" },
  { label: "Sale", to: "/shop?sale=true", accent: true, isActive: (path, p) => onShop(path) && p.get("sale") === "true" },
  { label: "About us", to: "/about", isActive: (path) => path === "/about" || path.startsWith("/help/") || path === "/track" },
  { label: "Contact", to: "/contact", isActive: (path) => path === "/contact" },
];

const linkClass = (active: boolean, accent?: boolean) =>
  cn(
    "relative whitespace-nowrap py-1 text-sm font-medium transition-colors hover:text-foreground",
    active ? "text-foreground" : "text-muted-foreground",
    accent && "text-brand hover:text-brand",
    "after:absolute after:-bottom-0.5 after:left-0 after:h-px after:bg-brand after:transition-all after:duration-300",
    active ? "after:w-full" : "after:w-0 hover:after:w-full",
  );

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
  const params = new URLSearchParams(location.search);

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [location]);

  // Exactly one link is highlighted. When filters overlap (e.g. men + sale), the more specific
  // campaign section wins: Sale > New in > Women / Men > Shop.
  const priority = ["Sale", "New in", "Shop", "Home", "About us", "Contact"];
  const activeLabel = priority.find((label) => {
    const item = navItems.find((entry) => entry.label === label);
    return item?.isActive(location.pathname, params);
  });
  const isActive = (item: NavItem) => item.label === activeLabel;

  const iconButton =
    "relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-accent/70";

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="container flex h-[68px] items-center justify-between gap-4 lg:gap-6">
        {/* Wordmark */}
        <Link to="/" className="flex items-baseline gap-0.5 font-display text-2xl tracking-tight text-foreground">
          ecom
          <span className="text-brand">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 md:flex lg:gap-8">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <NavLink key={item.label} to={item.to} className={linkClass(active, item.accent)}>
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button type="button" className={iconButton} aria-label="Search products" onClick={() => setSearchOpen(true)}>
            <Search className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </button>
          <button
            type="button"
            className={cn(iconButton, "hidden sm:flex")}
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="h-[18px] w-[18px]" strokeWidth={1.8} /> : <Moon className="h-[18px] w-[18px]" strokeWidth={1.8} />}
          </button>
          <Link to="/wishlist" className={cn(iconButton, "hidden sm:flex")} aria-label="Wishlist">
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
            <>
              <Link to="/login" className={cn(iconButton, "lg:hidden")} aria-label="Sign in">
                <UserRound className="h-[18px] w-[18px]" strokeWidth={1.8} />
              </Link>
              <Button asChild size="sm" className="ml-2 hidden rounded-full px-5 lg:inline-flex">
                <Link to="/login">
                  <UserRound className="h-4 w-4" strokeWidth={2} />
                  Sign in
                </Link>
              </Button>
            </>
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
            {navItems.map((item) => {
              const active = isActive(item);
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between border-b border-border/60 py-3 font-display text-xl transition last:border-b-0",
                    active ? "border-l-2 border-l-brand pl-3 text-brand" : item.accent ? "text-brand" : "text-foreground",
                  )}
                >
                  {item.label}
                  <span className={cn("text-sm", active ? "text-brand" : "text-muted-foreground")}>→</span>
                </NavLink>
              );
            })}
            <div className="mt-3 grid grid-cols-2 gap-2 sm:hidden">
              <Link to="/wishlist" className="flex items-center justify-center gap-2 rounded-full border border-border bg-card py-2.5 text-sm font-semibold">
                <Heart className="h-4 w-4" strokeWidth={1.8} />
                Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
              </Link>
              <button type="button" onClick={onToggleTheme} className="flex items-center justify-center gap-2 rounded-full border border-border bg-card py-2.5 text-sm font-semibold">
                {theme === "dark" ? <Sun className="h-4 w-4" strokeWidth={1.8} /> : <Moon className="h-4 w-4" strokeWidth={1.8} />}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </button>
            </div>
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
