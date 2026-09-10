import type { Product } from "@/data/types";
import { ProductCard } from "@/components/store/product-card";

type ProductGridProps = {
  products: Product[];
  title?: string;
  description?: string;
  eyebrow?: string;
};

export function ProductGrid({
  products,
  title = "Best sellers for modern routines",
  description = "A refined edit of practical, premium pieces for everyday routines.",
  eyebrow = "Trending Products",
}: ProductGridProps) {
  return (
    <section className="py-10 sm:py-14">
      <div className="container">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              {eyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">{title}</h2>
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
