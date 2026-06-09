import { Link } from "react-router-dom";
import { CategoryGrid } from "@/components/sections/category-grid";
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
      <CategoryGrid />
      <ProductGrid
        products={featuredProducts}
        title="Best sellers for modern routines"
        description="Customer favorites across apparel, audio, desk setup, and carry goods."
      />
      <section className="pb-6">
        <div className="container flex justify-center">
          <Button asChild size="lg" variant="outline">
            <Link to="/shop">View all products</Link>
          </Button>
        </div>
      </section>
      <ValueProps />
      <Newsletter email={email} setEmail={setEmail} onSubmit={submitNewsletter} />
    </>
  );
}
