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

  return (
    <Card className="group overflow-hidden transition duration-200 hover:-translate-y-1 hover:border-primary/40">
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
          <div className="absolute left-3 top-3 flex items-center gap-2">
            {product.badge ? <Badge>{product.badge}</Badge> : null}
            <Badge variant="outline">{product.category}</Badge>
          </div>
          <button
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-md bg-card/95 text-foreground shadow-sm backdrop-blur transition hover:scale-105"
            aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name}`}
            onClick={() => toggleWishlist(product)}
          >
            <Heart className={`h-4 w-4 ${saved ? "fill-current text-primary" : ""}`} />
          </button>
        </div>
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-semibold text-foreground">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>
            <Link to={`/product/${product.slug}`} className="block">
              <h3 className="text-lg font-bold">{product.name}</h3>
            </Link>
            <p className="line-clamp-2 min-h-12 text-sm leading-6 text-muted-foreground">{product.description}</p>
          </div>
          <div className="flex items-end justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold">${product.price.toFixed(2)}</span>
              {product.originalPrice ? (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              ) : null}
            </div>
            <Button asChild size="sm" variant="outline" aria-label={`View ${product.name}`}>
              <Link to={`/product/${product.slug}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="sm" onClick={() => addToCart(product)} aria-label={`Add ${product.name} to cart`}>
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
