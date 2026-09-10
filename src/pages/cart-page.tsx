import { CreditCard, ShieldCheck, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { CartLineItem } from "@/components/store/cart-line-item";
import { EmptyState } from "@/components/store/empty-state";
import { PageHero } from "@/components/store/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { shippingFor } from "@/lib/pricing";
import { useAuth } from "@/store/auth";
import { useStorefront } from "@/store/storefront";

export function CartPage() {
  const { cartItems } = useStorefront();
  const { user, addresses } = useAuth();
  const navigate = useNavigate();
  const defaultAddress = addresses.find((address) => address.isDefault);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const shipping = cartItems.length > 0 ? shippingFor(subtotal, "standard") : 0;
  const total = subtotal + shipping;

  return (
    <>
      <PageHero
        eyebrow="Cart"
        title="Shopping cart"
        description="Review quantities, delivery costs, and order total."
      />
      <section className="pb-16 pt-8 sm:pb-20">
        <div className="container grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {cartItems.length === 0 ? (
              <EmptyState
                title="Your cart is empty"
                description="Add something you love and it will show up here."
                actions={
                  <Button asChild>
                    <Link to="/shop">Browse products</Link>
                  </Button>
                }
              />
            ) : (
              cartItems.map((item) => <CartLineItem key={item.product.id} item={item} />)
            )}
          </div>
          <Card className="h-fit">
            <CardContent className="space-y-5 p-6">
              <div>
                <p className="text-2xl font-extrabold">Order summary</p>
                <p className="mt-1 text-sm text-muted-foreground">Secure checkout preview</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-semibold">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex items-center justify-between border-t border-border/70 pt-3 text-base">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-extrabold">${total.toFixed(2)}</span>
                </div>
              </div>
              <Button
                className="w-full rounded-full"
                size="lg"
                disabled={cartItems.length === 0}
                onClick={() => navigate(user ? "/checkout" : "/login?next=%2Fcheckout")}
              >
                <CreditCard className="h-4 w-4" />
                {user ? "Proceed to checkout" : "Sign in to checkout"}
              </Button>
              {user ? (
                <div className="rounded-xl border border-border bg-accent/30 p-4 text-sm dark:bg-accent/15">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Deliver to</p>
                  {defaultAddress ? (
                    <p className="mt-1 leading-6">
                      <span className="font-semibold">{defaultAddress.fullName}</span>
                      <br />
                      {defaultAddress.line1}, {defaultAddress.city} {defaultAddress.postalCode}
                    </p>
                  ) : (
                    <p className="mt-1 text-muted-foreground">
                      No address yet.{" "}
                      <Link to="/account/addresses" className="font-semibold text-brand hover:underline">Add one</Link>
                    </p>
                  )}
                </div>
              ) : null}
              <div className="grid gap-3 border-t border-border/80 pt-5 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  Express dispatch on stocked items
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Payments are protected
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
