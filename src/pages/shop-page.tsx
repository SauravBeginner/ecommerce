import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductFilters, type FilterState } from "@/components/store/product-filters";
import { ProductCard } from "@/components/store/product-card";
import { PageHero } from "@/components/store/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { useStorefront } from "@/store/storefront";

function matchesPrice(priceFilter: string, price: number) {
  if (priceFilter === "under-100") return price < 100;
  if (priceFilter === "100-150") return price >= 100 && price <= 150;
  if (priceFilter === "150-plus") return price > 150;
  return true;
}

export function ShopPage() {
  const { products } = useStorefront();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: searchParams.get("category") ?? "All",
    price: "all",
    sort: "featured",
  });

  const categories = [...new Set(products.map((product) => product.category))];

  const filteredProducts = useMemo(() => {
    const loweredSearch = filters.search.toLowerCase();

    const result = products.filter((product) => {
      const matchesSearch =
        loweredSearch.length === 0 ||
        product.name.toLowerCase().includes(loweredSearch) ||
        product.description.toLowerCase().includes(loweredSearch);
      const matchesCategory =
        filters.category === "All" || product.category === filters.category;

      return matchesSearch && matchesCategory && matchesPrice(filters.price, product.price);
    });

    if (filters.sort === "price-low") {
      return [...result].sort((a, b) => a.price - b.price);
    }

    if (filters.sort === "price-high") {
      return [...result].sort((a, b) => b.price - a.price);
    }

    if (filters.sort === "rating") {
      return [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [filters, products]);

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="All products"
        description="Find the right essentials by category, price, and rating."
      />
      <section className="pb-16">
        <div className="container grid gap-6 lg:grid-cols-[300px_1fr]">
          <ProductFilters
            filters={filters}
            categories={categories}
            onChange={setFilters}
            onReset={() =>
              setFilters({
                search: "",
                category: "All",
                price: "all",
                sort: "featured",
              })
            }
          />
          <div className="space-y-5">
            <Card className="shadow-none">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                    <SlidersHorizontal className="h-5 w-5" />
                  </div>
                  <p className="text-lg font-bold">{filteredProducts.length} products</p>
                </div>
                <div className="rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground">
                  {filters.category === "All" ? "All categories" : filters.category}
                </div>
              </CardContent>
            </Card>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
