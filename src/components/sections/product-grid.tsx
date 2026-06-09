import type { Product } from "@/data/types";
import { ProductCard } from "@/components/store/product-card";

type ProductGridProps = {
  products: Product[];
  title?: string;
  description?: string;
};

export function ProductGrid({
  products,
  title = "Best sellers for modern routines",
  description = "A refined edit of practical, premium pieces for everyday routines.",
}: ProductGridProps) {
  return (
    <section id="shop" className="py-12 sm:py-16">
      <div className="container">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Featured Products
            </p>
            <h2 className="mt-2 text-3xl font-extrabold">{title}</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
