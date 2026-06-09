import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { CartItem } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useStorefront } from "@/store/storefront";

type CartLineItemProps = {
  item: CartItem;
};

export function CartLineItem({ item }: CartLineItemProps) {
  const { updateCartQuantity, removeFromCart } = useStorefront();

  return (
    <Card>
      <CardContent className="flex flex-col gap-5 p-5 sm:flex-row">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="h-36 w-full rounded-md object-cover sm:w-32"
        />
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-md">
            <Link to={`/product/${item.product.slug}`} className="text-xl font-bold">
              {item.product.name}
            </Link>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.product.description}
            </p>
            <p className="mt-3 text-sm font-semibold text-primary">{item.product.category}</p>
          </div>
          <div className="flex flex-col gap-4 sm:items-end">
            <p className="text-2xl font-extrabold">
              ${(item.product.price * item.quantity).toFixed(2)}
            </p>
            <div className="flex items-center gap-2 rounded-md border border-border/80 bg-card p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                aria-label={`Decrease quantity of ${item.product.name}`}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="min-w-10 text-center text-sm font-semibold">{item.quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                aria-label={`Increase quantity of ${item.product.name}`}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <button
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
              onClick={() => removeFromCart(item.product.id)}
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
