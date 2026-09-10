import type { ChangeEvent } from "react";
import { Check, RotateCcw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type FilterState = {
  search: string;
  category: string;
  price: string;
  sort: string;
  sale: boolean;
  newOnly: boolean;
  gender: "all" | "women" | "men" | "unisex";
};

type ProductFiltersProps = {
  filters: FilterState;
  categories: string[];
  counts: Record<string, number>;
  total: number;
  onChange: (next: FilterState) => void;
  onReset: () => void;
};

const priceOptions = [
  { value: "all", label: "All" },
  { value: "under-100", label: "Under $100" },
  { value: "100-150", label: "$100 – $150" },
  { value: "150-plus", label: "$150+" },
];

export function ProductFilters({
  filters,
  categories,
  counts,
  total,
  onChange,
  onReset,
}: ProductFiltersProps) {
  const isDirty =
    filters.search !== "" || filters.category !== "All" || filters.price !== "all" || filters.sale || filters.newOnly || filters.gender !== "all";

  const setSearch = (event: ChangeEvent<HTMLInputElement>) =>
    onChange({ ...filters, search: event.target.value });

  const categoryRows = [{ name: "All", count: total }, ...categories.map((name) => ({ name, count: counts[name] ?? 0 }))];

  return (
    <aside className="min-w-0 space-y-7 lg:sticky lg:top-24">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={filters.search}
          onChange={setSearch}
          placeholder="Search products"
          className="h-11 rounded-full border-border bg-card pl-11 text-sm shadow-soft"
        />
      </div>

      {/* Shop for */}
      <div>
        <h3 className="mb-3 font-display text-lg">Shop for</h3>
        <div className="grid grid-cols-4 gap-1 rounded-full border border-border bg-card p-1 text-xs font-semibold">
          {(["all", "women", "men", "unisex"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ ...filters, gender: value })}
              className={cn(
                "rounded-full py-1.5 capitalize transition",
                filters.gender === value ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {value === "all" ? "All" : value}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg">Categories</h3>
          {isDirty ? (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          ) : null}
        </div>
        <ul className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0">
          {categoryRows.map((row) => {
            const active = filters.category === row.name;
            return (
              <li key={row.name} className="shrink-0">
                <button
                  type="button"
                  onClick={() => onChange({ ...filters, category: row.name })}
                  className={cn(
                    "flex w-full items-center justify-between gap-4 rounded-full px-4 py-2 text-sm transition lg:rounded-lg lg:px-3",
                    active
                      ? "bg-foreground text-background"
                      : "bg-card text-foreground hover:bg-accent/60 lg:bg-transparent",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={cn(
                        "hidden h-4 w-4 items-center justify-center rounded-full border lg:flex",
                        active ? "border-background bg-brand text-brand-foreground" : "border-border",
                      )}
                    >
                      {active ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : null}
                    </span>
                    {row.name === "All" ? "All products" : row.name}
                  </span>
                  <span className={cn("text-xs", active ? "text-background/70" : "text-muted-foreground")}>
                    {row.count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Price */}
      <div>
        <h3 className="mb-3 font-display text-lg">Price</h3>
        <div className="flex flex-wrap gap-2">
          {priceOptions.map((option) => {
            const active = filters.price === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange({ ...filters, price: option.value })}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                  active
                    ? "border-brand bg-brand text-brand-foreground"
                    : "border-border bg-card text-foreground hover:border-foreground/40",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* New / Sale toggles */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
      <button
        type="button"
        onClick={() => onChange({ ...filters, newOnly: !filters.newOnly, sale: false })}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition",
          filters.newOnly ? "border-brand bg-brand/10 text-brand" : "border-border bg-card hover:border-foreground/40",
        )}
      >
        New arrivals only
        <span className={cn("h-5 w-9 rounded-full p-0.5 transition", filters.newOnly ? "bg-brand" : "bg-border")}>
          <span className={cn("block h-4 w-4 rounded-full bg-card transition", filters.newOnly && "translate-x-4")} />
        </span>
      </button>
      <button
        type="button"
        onClick={() => onChange({ ...filters, sale: !filters.sale, newOnly: false })}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition",
          filters.sale ? "border-brand bg-brand/10 text-brand" : "border-border bg-card hover:border-foreground/40",
        )}
      >
        On sale only
        <span className={cn("h-5 w-9 rounded-full p-0.5 transition", filters.sale ? "bg-brand" : "bg-border")}>
          <span className={cn("block h-4 w-4 rounded-full bg-card transition", filters.sale && "translate-x-4")} />
        </span>
      </button>
      </div>

      {/* Promo tile */}
      <div className="hidden overflow-hidden rounded-2xl bg-foreground p-5 text-background lg:block">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-background/60">Member offer</p>
        <p className="mt-2 font-display text-2xl leading-tight">10% off your first order</p>
        <p className="mt-2 text-xs text-background/70">
          Use code <span className="font-bold text-background">NORTHSTAR10</span> at checkout.
        </p>
      </div>
    </aside>
  );
}
