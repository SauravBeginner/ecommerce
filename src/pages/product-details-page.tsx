import { Check, Heart, RotateCcw, ShieldCheck, ShoppingBag, Star, Truck } from "lucide-react";
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
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0] ?? "");
      setSelectedSize(product.sizes[0] ?? "");
      setActiveImage(0);
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

  const saved = product ? isWishlisted(product.id) : false;
  const gallery = product.images?.length ? product.images : [product.image];
  const mainImage = gallery[activeImage] ?? gallery[0];
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <>
      <section className="pb-4 pt-8 sm:pt-10">
        <div className="container grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col gap-4">
          <Card className="relative overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  key={mainImage}
                  src={mainImage}
                  alt={product.name}
                  className="h-full w-full animate-in fade-in object-cover duration-300"
                />
              </div>
              <Badge variant="outline" className="absolute left-4 top-4 bg-card/90 backdrop-blur-sm">
                {product.category}
              </Badge>
              <button
                type="button"
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-card/95 text-foreground shadow-soft backdrop-blur transition hover:scale-105"
                aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
                aria-pressed={saved}
                onClick={() => toggleWishlist(product)}
              >
                <Heart className={cn("h-5 w-5", saved && "fill-brand text-brand")} />
              </button>
            </CardContent>
          </Card>
          <div className="grid grid-cols-4 gap-3" role="tablist" aria-label="Product images">
            {gallery.map((src, index) => {
              const active = index === activeImage;
              return (
                <button
                  key={src}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`View image ${index + 1} of ${gallery.length}`}
                  onClick={() => setActiveImage(index)}
                  onMouseEnter={() => setActiveImage(index)}
                  className={cn(
                    "aspect-square overflow-hidden rounded-xl border-2 bg-accent/40 transition dark:bg-accent/20",
                    active ? "border-brand shadow-soft" : "border-transparent opacity-70 hover:opacity-100",
                  )}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              );
            })}
          </div>
          <div className="mt-auto grid divide-y divide-border/70 rounded-2xl border border-border/70 bg-accent/40 dark:bg-accent/20 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              { icon: Truck, title: "Ships in 24h", text: "Free over $120" },
              { icon: RotateCcw, title: "Free returns", text: "30-day window" },
              { icon: ShieldCheck, title: "Secure checkout", text: "Fully protected" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-center gap-3 px-4 py-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0">
                    <p className="whitespace-nowrap text-sm font-semibold leading-tight">{item.title}</p>
                    <p className="whitespace-nowrap text-xs text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-2">
              {product.gender ? <Badge variant="outline" className="capitalize">{product.gender}</Badge> : null}
              {product.badge ? <Badge className="uppercase tracking-wide">{product.badge}</Badge> : null}
              {discount ? <Badge>-{discount}% off</Badge> : null}
              <div className="flex items-center gap-1.5 text-sm text-brand">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-semibold text-foreground">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews} reviews)</span>
              </div>
            </div>
            <div>
              <h1 className="font-display text-4xl sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
                {product.longDescription}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-4xl font-extrabold">${product.price.toFixed(2)}</span>
              {product.originalPrice ? (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              ) : null}
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                  product.stock > 10
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "bg-brand/10 text-brand",
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", product.stock > 10 ? "bg-emerald-500" : "bg-brand")} />
                {product.stock > 10 ? "In stock" : `Only ${product.stock} left`}
              </span>
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
                      style={{ background: colorToSwatch(color) }}
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
            <Button size="lg" className="w-full rounded-full sm:w-auto sm:min-w-[220px] sm:self-start" onClick={() => addToCart(product)}>
              <ShoppingBag className="h-4 w-4" />
              Add to cart
            </Button>
            <Card className="mt-auto">
              <CardContent className="p-6">
                <p className="text-lg font-bold">Key features</p>
                <ul className="mt-4 grid gap-x-6 gap-y-2.5 text-sm leading-6 text-muted-foreground sm:grid-cols-2">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-brand" />
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
          description="More pieces from the same collection, picked to pair with this one."
          eyebrow="Related Products"
        />
      ) : null}
    </>
  );
}

function colorToSwatch(color: string) {
  const swatches: Record<string, string> = {
    Assorted: "linear-gradient(135deg,#d8c3a5,#b96f51,#3a3d42)",
    Black: "#16181d",
    Blue: "#3b5bdb",
    Blush: "#e8b4b8",
    Bone: "#e9e2d2",
    Bronze: "#b08d57",
    Brown: "#6b4a2b",
    Burgundy: "#6d1f2c",
    Camel: "#c19a6b",
    Chambray: "#7f9cc0",
    Charcoal: "#3a3d42",
    Chrome: "linear-gradient(135deg,#f4f4f4,#9ea3a8)",
    Clay: "#b96f51",
    Coral: "#f08a6b",
    Cream: "#f3ecdc",
    Crimson: "#b91c1c",
    Ecru: "#e6dcc3",
    Fog: "#d8dee5",
    Gold: "#d4af37",
    Graphite: "#4b5563",
    Green: "#3f6b3f",
    Grey: "#9ca3af",
    Ink: "#172033",
    Ivory: "#f5f1e6",
    Mauve: "#b58aa5",
    Midnight: "#111827",
    Mint: "#a8e0c8",
    Moss: "#61724b",
    Multi: "linear-gradient(135deg,#f08a6b,#d4af37,#3b5bdb)",
    Navy: "#1e2a4a",
    Oak: "#c8a071",
    Oat: "#e2d4bd",
    Olive: "#68724a",
    Onyx: "#171717",
    Oxblood: "#5a1f24",
    Rose: "#d9a1a8",
    "Rose Gold": "#d9a08a",
    Rust: "#a5462a",
    Sage: "#a3b18a",
    Sand: "#d8c3a5",
    Scarlet: "#c8102e",
    Silver: "#c8ced6",
    Sky: "#9cc9ea",
    Slate: "#64748b",
    "Space Grey": "#5b5f66",
    Steel: "#8a9199",
    Stone: "#a8a29e",
    Tan: "#c98f5a",
    Teal: "#1f6f78",
    Terracotta: "#c0623c",
    Tortoise: "linear-gradient(135deg,#6b3a1a,#c98f5a,#2b1b0f)",
    Walnut: "#6f4a2f",
    White: "#ffffff",
    "White/Orange": "linear-gradient(135deg,#ffffff 50%,#e0703a 50%)",
    "White/Red": "linear-gradient(135deg,#ffffff 50%,#c8102e 50%)",
  };

  return swatches[color] ?? "#d1d5db";
}
