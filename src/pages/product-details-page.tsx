import { Check, Heart, ShieldCheck, Star, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EmptyState } from "@/components/store/empty-state";
import { ProductGrid } from "@/components/sections/product-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useStorefront } from "@/store/storefront";

export function ProductDetailsPage() {
  const { slug } = useParams();
  const { products, addToCart, toggleWishlist, isWishlisted } = useStorefront();
  const product = products.find((item) => item.slug === slug);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0] ?? "");
      setSelectedSize(product.sizes[0] ?? "");
    }
  }, [product?.id]);

  if (!product) {
    return (
      <section className="py-16">
        <div className="container">
          <EmptyState
            title="Product not found"
            description="That product page could not be loaded. Head back to the catalog and choose another item."
            actions={
              <Button asChild>
                <Link to="/shop">Back to shop</Link>
              </Button>
            }
          />
        </div>
      </section>
    );
  }

  const relatedProducts = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <>
      <section className="py-12 sm:py-16">
        <div className="container grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="overflow-hidden self-start">
            <CardContent className="p-0">
              <img
                src={product.image}
                alt={product.name}
                className="h-[420px] w-full object-cover sm:h-[560px]"
              />
            </CardContent>
          </Card>
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              {product.badge ? <Badge>{product.badge}</Badge> : null}
              <Badge variant="outline">{product.category}</Badge>
              {discount ? (
                <Badge className="bg-rose-500 text-white hover:bg-rose-500">-{discount}% off</Badge>
              ) : null}
              <div className="flex items-center gap-1.5 text-sm text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-semibold text-foreground">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                {product.longDescription}
              </p>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold">${product.price.toFixed(2)}</span>
              {product.originalPrice ? (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              ) : null}
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold">Available colors</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-all duration-150",
                      selectedColor === color
                        ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                        : "border-border/80 bg-card text-foreground hover:border-primary/50 hover:bg-muted/40"
                    )}
                  >
                    <span
                      className="h-4 w-4 shrink-0 rounded-sm border border-black/10"
                      style={{ backgroundColor: colorToSwatch(color) }}
                    />
                    {color}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold">Sizes</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "rounded-md border px-4 py-2 text-sm font-medium transition-all duration-150",
                      selectedSize === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border/80 bg-card text-foreground hover:border-primary/50 hover:bg-muted/40"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => addToCart(product)}>
                Add to cart
              </Button>
              <Button size="lg" variant="outline" onClick={() => toggleWishlist(product)}>
                <Heart className={`h-4 w-4 ${isWishlisted(product.id) ? "fill-current text-primary" : ""}`} />
                {isWishlisted(product.id) ? "Saved to wishlist" : "Save to wishlist"}
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border/80 bg-card p-5">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <p className="font-semibold">Ships in 24 hours</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  In-stock units available: {product.stock}
                </p>
              </div>
              <div className="rounded-lg border border-border/80 bg-card p-5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <p className="font-semibold">Protected checkout</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Buyer-friendly returns and secure payment handling.
                </p>
              </div>
            </div>
            <Card>
              <CardContent className="space-y-3 p-6">
                <p className="text-lg font-bold">Key features</p>
                <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {relatedProducts.length > 0 ? (
        <ProductGrid
          products={relatedProducts}
          title="You may also like"
          description="Related products from the same collection keep the detail page feeling like a real storefront."
          eyebrow="Related Products"
        />
      ) : null}
    </>
  );
}

function colorToSwatch(color: string) {
  const swatches: Record<string, string> = {
    Black: "#16181d",
    Bone: "#e9e2d2",
    Charcoal: "#3a3d42",
    Clay: "#b96f51",
    Fog: "#d8dee5",
    Graphite: "#4b5563",
    Ink: "#172033",
    Ivory: "#f5f1e6",
    Midnight: "#111827",
    Moss: "#61724b",
    Olive: "#68724a",
    Onyx: "#171717",
    Sand: "#d8c3a5",
    Silver: "#c8ced6",
    Slate: "#64748b",
    Stone: "#a8a29e",
    White: "#ffffff",
  };

  return swatches[color] ?? "#d1d5db";
}
