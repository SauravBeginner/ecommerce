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
        title="Your wishlist"
        description="Pieces you have saved. They stay here until you are ready to buy."
      />
      <section className="pb-16 pt-8 sm:pb-20">
        <div className="container">
          {wishlistProducts.length === 0 ? (
            <EmptyState
              title="Your wishlist is empty"
              description="Tap the heart on any product to save it here."
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
