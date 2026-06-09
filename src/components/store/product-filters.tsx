import type { ChangeEvent } from "react";
import { RotateCcw, Search } from "lucide-react";
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
      <CardContent className="space-y-5 p-5">
        <div>
          <p className="text-lg font-bold">Search and filter</p>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-semibold">Search</span>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={filters.search}
              onChange={updateField("search")}
              placeholder="Search products"
              className="pl-11"
            />
          </div>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold">Category</span>
          <select
            value={filters.category}
            onChange={updateField("category")}
            className="flex h-11 w-full rounded-md border border-input bg-background px-4 text-sm outline-none ring-ring focus:ring-2"
          >
            <option value="All">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold">Price range</span>
          <select
            value={filters.price}
            onChange={updateField("price")}
            className="flex h-11 w-full rounded-md border border-input bg-background px-4 text-sm outline-none ring-ring focus:ring-2"
          >
            <option value="all">All prices</option>
            <option value="under-100">Under $100</option>
            <option value="100-150">$100 to $150</option>
            <option value="150-plus">$150+</option>
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-semibold">Sort by</span>
          <select
            value={filters.sort}
            onChange={updateField("sort")}
            className="flex h-11 w-full rounded-md border border-input bg-background px-4 text-sm outline-none ring-ring focus:ring-2"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to high</option>
            <option value="price-high">Price: High to low</option>
            <option value="rating">Top rated</option>
          </select>
        </label>

        <Button
          type="button"
          onClick={onReset}
          variant="outline"
          className="w-full"
        >
          <RotateCcw className="h-4 w-4" />
          Reset filters
        </Button>
      </CardContent>
    </Card>
  );
}
