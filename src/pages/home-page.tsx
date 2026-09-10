import { Link } from "react-router-dom";
import { BrandStrip } from "@/components/sections/brand-strip";
import { CategoryGrid } from "@/components/sections/category-grid";
import { PromoBanners } from "@/components/sections/promo-banners";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { ValueProps } from "@/components/sections/value-props";
import { Button } from "@/components/ui/button";
import { useStorefront } from "@/store/storefront";

export function HomePage() {
  const { featuredProducts, email, setEmail, submitNewsletter } = useStorefront();

  return (
    <>
      <Hero />
      <ValueProps />
      <CategoryGrid />
      <PromoBanners />
      <ProductGrid
        products={featuredProducts}
        title="Trending this season"
        description="Customer favourites across apparel, audio, desk setup, and carry goods."
      />
      <section className="pb-6">
        <div className="container flex justify-center">
          <Button asChild size="lg" variant="outline">
            <Link to="/shop">View all products</Link>
          </Button>
        </div>
      </section>
      <BrandStrip />
      <Newsletter email={email} setEmail={setEmail} onSubmit={submitNewsletter} />
    </>
  );
}
