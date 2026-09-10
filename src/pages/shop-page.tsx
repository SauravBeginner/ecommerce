import { ArrowUpDown, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductFilters, type FilterState } from "@/components/store/product-filters";
import { ProductCard } from "@/components/store/product-card";
import { PageHero } from "@/components/store/page-hero";
import { EmptyState } from "@/components/store/empty-state";
import { useDebouncedValue } from "@/lib/use-debounced-value";
import { useStorefront } from "@/store/storefront";

function matchesPrice(priceFilter: string, price: number) {
  if (priceFilter === "under-100") return price < 100;
  if (priceFilter === "100-150") return price >= 100 && price <= 150;
  if (priceFilter === "150-plus") return price > 150;
  return true;
}

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "new", label: "Newest" },
  { value: "price-low", label: "Price: Low to high" },
  { value: "price-high", label: "Price: High to low" },
  { value: "rating", label: "Top rated" },
];

const defaultFilters: FilterState = { search: "", category: "All", price: "all", sort: "featured", sale: false };

export function ShopPage() {
  const { products } = useStorefront();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    search: searchParams.get("q") ?? "",
    category: searchParams.get("category") ?? "All",
    sort: searchParams.get("sort") ?? "featured",
    sale: searchParams.get("sale") === "true",
  });

  useEffect(() => {
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");
    const sale = searchParams.get("sale") === "true";
    const q = searchParams.get("q");
    setFilters((f) => ({
      ...f,
      ...(category ? { category } : {}),
      ...(sort ? { sort } : {}),
      ...(q !== null ? { search: q } : {}),
      sale,
    }));
  }, [searchParams]);

  const categories = [...new Set(products.map((product) => product.category))];
  const counts = useMemo(
    () =>
      products.reduce<Record<string, number>>((acc, product) => {
        acc[product.category] = (acc[product.category] ?? 0) + 1;
        return acc;
      }, {}),
    [products],
  );

  const debouncedSearch = useDebouncedValue(filters.search, 250);

  const filteredProducts = useMemo(() => {
    const loweredSearch = debouncedSearch.trim().toLowerCase();

    const result = products.filter((product) => {
      const matchesSearch =
        loweredSearch.length === 0 ||
        product.name.toLowerCase().includes(loweredSearch) ||
        product.description.toLowerCase().includes(loweredSearch);
      const matchesCategory =
        filters.category === "All" || product.category === filters.category;

      const matchesSale = !filters.sale || Boolean(product.originalPrice);

      return matchesSearch && matchesCategory && matchesSale && matchesPrice(filters.price, product.price);
    });

    if (filters.sort === "price-low") return [...result].sort((a, b) => a.price - b.price);
    if (filters.sort === "price-high") return [...result].sort((a, b) => b.price - a.price);
    if (filters.sort === "rating") return [...result].sort((a, b) => b.rating - a.rating);
    if (filters.sort === "new") return [...result].sort((a, b) => b.id - a.id);
    return result;
  }, [filters.category, filters.price, filters.sort, filters.sale, debouncedSearch, products]);

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title={filters.search ? `Results for “${filters.search}”` : filters.sale ? "Sale" : filters.category === "All" ? "All products" : filters.category}
        description={filters.sale ? "Limited-time prices across the edit." : "Find the right essentials by category, price, and rating."}
      />
      <section className="pb-16 pt-8 sm:pb-20">
        <div className="container grid gap-8 lg:grid-cols-[260px_1fr]">
          <ProductFilters
            filters={filters}
            categories={categories}
            counts={counts}
            total={products.length}
            onChange={setFilters}
            onReset={() => setFilters(defaultFilters)}
          />
          <div className="space-y-5">
            <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> of{" "}
                {products.length} products
              </p>
              <label className="relative inline-flex items-center">
                <ArrowUpDown className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={filters.sort}
                  onChange={(event) => setFilters({ ...filters, sort: event.target.value })}
                  className="h-10 cursor-pointer appearance-none rounded-full border border-border bg-card pl-9 pr-9 text-sm font-medium outline-none focus:ring-2 focus:ring-ring"
                  aria-label="Sort products"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-muted-foreground" />
              </label>
            </div>
            {filteredProducts.length === 0 ? (
              <EmptyState
                title="No products match"
                description="Try a different search term or clear the filters."
              />
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
