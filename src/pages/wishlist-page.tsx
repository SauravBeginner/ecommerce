import { Link } from "react-router-dom";
import { EmptyState } from "@/components/store/empty-state";
import { PageHero } from "@/components/store/page-hero";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { useStorefront } from "@/store/storefront";

export function WishlistPage() {
  const { wishlistProducts } = useStorefront();

  return (
    <>
      <PageHero
        eyebrow="Wishlist"
        title="Saved pieces for later"
        description="This page gives the store a dedicated wishlist flow so customers can park favorites before they are ready to buy."
      />
      <section className="pb-16">
        <div className="container">
          {wishlistProducts.length === 0 ? (
            <EmptyState
              title="Your wishlist is empty"
              description="Save products from the catalog or the product details screen and they will show up here."
              actions={
                <Button asChild>
                  <Link to="/shop">Explore the shop</Link>
                </Button>
              }
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {wishlistProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
