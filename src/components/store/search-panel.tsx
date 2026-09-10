import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useStorefront } from "@/store/storefront";

type SearchPanelProps = {
  open: boolean;
  onClose: () => void;
};

const suggestions = ["Sneakers", "Headphones", "Blazer", "Watch", "Desk lamp", "Backpack"];

export function SearchPanel({ open, onClose }: SearchPanelProps) {
  const { products } = useStorefront();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const focus = window.setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(focus);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const term = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!term) return [];
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term),
    );
  }, [products, term]);
  const shown = matches.slice(0, 6);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!term) return;
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label="Search products">
      <button type="button" className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" aria-label="Close search" onClick={onClose} />
      <div className="absolute inset-x-0 top-0 border-b border-border bg-background shadow-md animate-in slide-in-from-top-2 fade-in duration-200">
        <div className="container py-5">
          <form onSubmit={submit} className="relative">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, categories…"
              className="h-14 w-full rounded-full border border-border bg-card pl-14 pr-14 font-display text-xl outline-none ring-ring placeholder:font-sans placeholder:text-base placeholder:text-muted-foreground focus:ring-2"
              aria-label="Search"
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent/70 hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </form>

          {!term ? (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="mr-1 text-muted-foreground">Popular:</span>
              {suggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setQuery(item)}
                  className="rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold transition hover:border-foreground/40"
                >
                  {item}
                </button>
              ))}
            </div>
          ) : matches.length === 0 ? (
            <p className="mt-5 text-sm text-muted-foreground">
              No matches for “{query.trim()}”. Try a category like “Audio” or “Footwear”.
            </p>
          ) : (
            <div className="mt-4">
              <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
                {shown.map((product) => (
                  <li key={product.id}>
                    <Link
                      to={`/product/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-accent/60"
                    >
                      <img src={product.image} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                      <span className="ml-auto text-sm font-bold">${product.price.toFixed(2)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={submit}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
              >
                View all {matches.length} result{matches.length === 1 ? "" : "s"}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
