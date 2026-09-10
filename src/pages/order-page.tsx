import { ArrowRight, Check, CreditCard, MapPin, Package, Truck } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { money } from "@/lib/pricing";
import { useAuth } from "@/store/auth";

export function OrderPage() {
  const { id } = useParams();
  const { user, orders } = useAuth();
  const order = orders.find((item) => item.id === id);

  if (!user) return <Navigate to="/login" replace />;
  if (!order) return <Navigate to="/account/orders" replace />;

  const placed = new Date(order.placedAt);
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const meta = [
    {
      icon: MapPin,
      title: "Deliver to",
      lines: [
        order.address.fullName,
        `${order.address.line1}${order.address.line2 ? `, ${order.address.line2}` : ""}`,
        `${order.address.city}, ${order.address.state} ${order.address.postalCode}`,
        order.address.phone,
      ],
    },
    { icon: Truck, title: order.delivery.label, lines: [`Arrives in ${order.delivery.eta}`] },
    {
      icon: CreditCard,
      title: order.payment.label,
      lines: [order.payment.method === "cod" ? "Pay when it arrives" : "Payment confirmed (demo)"],
    },
  ];

  return (
    <section className="pb-16 pt-10 sm:pb-20 sm:pt-14">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
            <Check className="h-6 w-6" strokeWidth={3} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">Order confirmed</p>
            <h1 className="mt-1 font-display text-3xl sm:text-4xl">Thank you, {order.address.fullName.split(" ")[0]}.</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Order <span className="font-semibold text-foreground">{order.id}</span> ·{" "}
              {placed.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })} · confirmation sent to {user.email}
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/account/orders">
                <Package className="h-4 w-4" />
                All orders
              </Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link to="/shop">
                Continue shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Items */}
          <Card className="h-fit">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-2xl">Items</h2>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  {order.status} · {itemCount} item{itemCount === 1 ? "" : "s"}
                </span>
              </div>
              <ul className="mt-4 divide-y divide-border">
                {order.items.map((item) => (
                  <li key={item.productId} className="flex items-center gap-4 py-4">
                    <Link to={`/product/${item.slug}`} className="shrink-0 overflow-hidden rounded-xl bg-accent/40">
                      <img src={item.image} alt="" className="h-20 w-20 object-cover" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link to={`/product/${item.slug}`} className="font-semibold hover:text-brand">{item.name}</Link>
                      <p className="mt-0.5 text-sm text-muted-foreground">{money(item.price)} × {item.quantity}</p>
                    </div>
                    <span className="font-bold">{money(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Receipt */}
          <Card className="h-fit lg:sticky lg:top-24">
            <CardContent className="p-6">
              <ul className="space-y-4">
                {meta.map((block) => {
                  const Icon = block.icon;
                  return (
                    <li key={block.title} className="flex gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                        <Icon className="h-4 w-4" strokeWidth={1.8} />
                      </span>
                      <div className="min-w-0 text-sm">
                        <p className="font-semibold">{block.title}</p>
                        {block.lines.filter(Boolean).map((line) => (
                          <p key={line} className="leading-6 text-muted-foreground">{line}</p>
                        ))}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 space-y-2 border-t border-border pt-5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">{money(order.subtotal)}</span></div>
                {order.discount > 0 ? (
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-300">
                    <span>Discount · {order.couponCode}</span>
                    <span className="font-semibold">−{money(order.discount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-semibold">{order.shipping === 0 ? "Free" : money(order.shipping)}</span></div>
                <div className="flex items-baseline justify-between border-t border-border pt-3">
                  <span className="font-bold">Total</span>
                  <span className="font-display text-2xl">{money(order.total)}</span>
                </div>
              </div>

              <p className="mt-5 rounded-xl bg-accent/40 p-3 text-xs leading-5 text-muted-foreground dark:bg-accent/20">
                Need to change something? Orders can be edited or cancelled within 1 hour of placing them from your account.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
