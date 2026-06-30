import type { ChangeEvent } from "react";
import { ChevronDown, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export type FilterState = {
  search: string;
  category: string;
  price: string;
  sort: string;
};

type ProductFiltersProps = {
  filters: FilterState;
  categories: string[];
  onChange: (next: FilterState) => void;
  onReset: () => void;
};

const selectClass =
  "w-full appearance-none rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm outline-none ring-ring focus:ring-2 cursor-pointer";

export function ProductFilters({
  filters,
  categories,
  onChange,
  onReset,
}: ProductFiltersProps) {
  const updateField =
    (field: keyof FilterState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onChange({ ...filters, [field]: event.target.value });
    };

  return (
    <Card className="lg:sticky lg:top-24">
      <CardContent className="space-y-4 p-4">
        <p className="font-semibold">Search and filter</p>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Search</span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={updateField("search")}
              placeholder="Search products"
              className="h-9 pl-9 text-sm"
            />
          </div>
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</span>
          <div className="relative">
            <select value={filters.category} onChange={updateField("category")} className={selectClass}>
              <option value="All">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          </div>
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Price range</span>
          <div className="relative">
            <select value={filters.price} onChange={updateField("price")} className={selectClass}>
              <option value="all">All prices</option>
              <option value="under-100">Under $100</option>
              <option value="100-150">$100 to $150</option>
              <option value="150-plus">$150+</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          </div>
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sort by</span>
          <div className="relative">
            <select value={filters.sort} onChange={updateField("sort")} className={selectClass}>
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to high</option>
              <option value="price-high">Price: High to low</option>
              <option value="rating">Top rated</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          </div>
        </label>

        <Button type="button" onClick={onReset} variant="outline" size="sm" className="w-full">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset filters
        </Button>
      </CardContent>
    </Card>
  );
}
