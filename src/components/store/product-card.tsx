import { Eye, Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useStorefront } from "@/store/storefront";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useStorefront();
  const saved = isWishlisted(product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <Card className="group overflow-hidden transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <Link to={`/product/${product.slug}`}>
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
          </Link>
          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            {product.badge ? <Badge>{product.badge}</Badge> : null}
            <Badge variant="outline" className="bg-card/90 backdrop-blur-sm">{product.category}</Badge>
          </div>
          {discount ? (
            <span className="absolute bottom-3 left-3 rounded-full bg-rose-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
              -{discount}%
            </span>
          ) : null}
          <button
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-md bg-card/95 text-foreground shadow-sm backdrop-blur transition hover:scale-105 hover:bg-card"
            aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
            onClick={() => toggleWishlist(product)}
          >
            <Heart className={`h-4 w-4 ${saved ? "fill-current text-primary" : ""}`} />
          </button>
        </div>
        <div className="space-y-3 p-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-sm text-amber-500">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="font-semibold text-foreground">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews})</span>
            </div>
            <Link to={`/product/${product.slug}`} className="block">
              <h3 className="text-base font-bold leading-snug transition-colors hover:text-primary">{product.name}</h3>
            </Link>
            <p className="line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">{product.description}</p>
          </div>
          <div className="flex items-center justify-between gap-2 pt-1">
            <div>
              <span className="text-xl font-extrabold">${product.price.toFixed(2)}</span>
              {product.originalPrice ? (
                <span className="ml-2 text-xs text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-1.5">
              <Button asChild size="sm" variant="outline" className="h-8 w-8 p-0" aria-label={`View ${product.name}`}>
                <Link to={`/product/${product.slug}`}>
                  <Eye className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button size="sm" className="h-8 w-8 p-0" onClick={() => addToCart(product)} aria-label={`Add ${product.name} to cart`}>
                <ShoppingBag className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
