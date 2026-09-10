import { type FormEvent, useMemo, useState } from "react";
import { Banknote, Check, CreditCard, Lock, MapPin, Plus, Smartphone, Truck } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type DeliveryId, coupons, deliveryOptions, discountFor, money, shippingFor } from "@/lib/pricing";
import { useAuth } from "@/store/auth";
import { useStorefront } from "@/store/storefront";

type PaymentMethod = "card" | "upi" | "cod";

const paymentMethods: { id: PaymentMethod; label: string; text: string; icon: typeof CreditCard }[] = [
  { id: "card", label: "Credit / debit card", text: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "upi", label: "UPI", text: "Google Pay, PhonePe, Paytm", icon: Smartphone },
  { id: "cod", label: "Cash on delivery", text: "Pay when it arrives", icon: Banknote },
];

const formatCardNumber = (value: string) =>
  value.replace(/\D/g, "").slice(0, 19).replace(/(\d{4})(?=\d)/g, "$1 ");

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits;
};

function StepHeading({ number, title, done }: { number: number; title: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
          done ? "bg-brand text-brand-foreground" : "bg-foreground text-background",
        )}
      >
        {done ? <Check className="h-4 w-4" strokeWidth={3} /> : number}
      </span>
      <h2 className="font-display text-2xl">{title}</h2>
    </div>
  );
}

export function CheckoutPage() {
  const { user, addresses, placeOrder } = useAuth();
  const { cartItems, clearCart, ready } = useStorefront();
  const navigate = useNavigate();

  const [addressId, setAddressId] = useState(() => addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? "");
  const [delivery, setDelivery] = useState<DeliveryId>("standard");
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" });
  const [upiId, setUpiId] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cartItems]);
  const discount = discountFor(subtotal, coupon);
  const shipping = shippingFor(subtotal - discount, delivery);
  const total = subtotal - discount + shipping;
  const selectedAddress = addresses.find((a) => a.id === addressId);

  if (!user) return <Navigate to="/login?next=%2Fcheckout" replace />;
  if (!ready) return null;
  if (cartItems.length === 0 && !placing) return <Navigate to="/cart" replace />;

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (coupons[code]) {
      setCoupon(code);
      setCouponMessage(`${code} applied · ${coupons[code].label}`);
    } else {
      setCoupon("");
      setCouponMessage("That code isn't valid.");
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!selectedAddress) return setError("Choose a delivery address.");
    if (payment === "card") {
      if (card.number.replace(/\s/g, "").length < 12 || !card.name.trim() || !card.expiry.trim() || card.cvc.length < 3)
        return setError("Enter your card details to continue.");
    }
    if (payment === "upi" && !/^[\w.-]+@[\w-]+$/.test(upiId.trim())) return setError("Enter a valid UPI ID, e.g. name@bank.");
    setError("");
    setPlacing(true);

    const option = deliveryOptions.find((item) => item.id === delivery)!;
    const method = paymentMethods.find((item) => item.id === payment)!;
    // Mock payment: no real charge. Replace this block with the gateway call (Razorpay / Stripe) once an API exists.
    window.setTimeout(() => {
      const order = placeOrder({
        items: cartItems.map((item) => ({
          productId: item.product.id,
          slug: item.product.slug,
          name: item.product.name,
          image: item.product.image,
          price: item.product.price,
          quantity: item.quantity,
        })),
        address: selectedAddress,
        delivery: { label: option.label, cost: shipping, eta: option.eta },
        payment: { method: payment, label: method.label },
        subtotal,
        discount,
        couponCode: coupon || undefined,
        shipping,
        total,
      });
      navigate(`/order/${order.id}`, { replace: true });
      clearCart();
    }, 900);
  };

  return (
    <section className="pb-16 pt-8 sm:pb-20 sm:pt-10">
      <div className="container">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">Checkout</p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">Almost yours</h1>

        <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]" noValidate>
          <div className="space-y-6">
            {/* 1. Address */}
            <Card>
              <CardContent className="p-6 sm:p-8">
                <StepHeading number={1} title="Delivery address" done={Boolean(selectedAddress)} />
                {addresses.length === 0 ? (
                  <div className="mt-5 rounded-xl border border-dashed border-border p-6 text-center">
                    <MapPin className="mx-auto h-6 w-6 text-brand" />
                    <p className="mt-2 text-sm text-muted-foreground">No saved addresses yet.</p>
                    <Button asChild size="sm" className="mt-3 rounded-full">
                      <Link to="/account/addresses">
                        <Plus className="h-4 w-4" />
                        Add an address
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {addresses.map((address) => {
                      const active = address.id === addressId;
                      return (
                        <label
                          key={address.id}
                          className={cn(
                            "cursor-pointer rounded-xl border p-4 text-sm transition",
                            active ? "border-brand bg-brand/5" : "border-border hover:border-foreground/40",
                          )}
                        >
                          <input type="radio" name="address" className="sr-only" checked={active} onChange={() => setAddressId(address.id)} />
                          <div className="flex items-center justify-between">
                            <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold">{address.label}</span>
                            {active ? <Check className="h-4 w-4 text-brand" strokeWidth={3} /> : null}
                          </div>
                          <p className="mt-2 font-semibold">{address.fullName}</p>
                          <p className="leading-6 text-muted-foreground">
                            {address.line1}
                            {address.line2 ? `, ${address.line2}` : ""}
                            <br />
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                        </label>
                      );
                    })}
                    <Link
                      to="/account/addresses"
                      className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border p-4 text-sm font-semibold text-muted-foreground transition hover:border-foreground/40 hover:text-foreground"
                    >
                      <Plus className="h-4 w-4" />
                      Add another address
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 2. Delivery */}
            <Card>
              <CardContent className="p-6 sm:p-8">
                <StepHeading number={2} title="Delivery method" done />
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {deliveryOptions.map((option) => {
                    const active = option.id === delivery;
                    const cost = option.id === "standard" && subtotal - discount >= 120 ? 0 : option.cost;
                    return (
                      <label
                        key={option.id}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm transition",
                          active ? "border-brand bg-brand/5" : "border-border hover:border-foreground/40",
                        )}
                      >
                        <input type="radio" name="delivery" className="sr-only" checked={active} onChange={() => setDelivery(option.id)} />
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                          <Truck className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold">{option.label}</span>
                          <span className="block text-xs text-muted-foreground">{option.eta}</span>
                        </span>
                        <span className="font-bold">{cost === 0 ? "Free" : money(cost)}</span>
                      </label>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 3. Payment */}
            <Card>
              <CardContent className="p-6 sm:p-8">
                <StepHeading number={3} title="Payment" />
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const active = method.id === payment;
                    return (
                      <label
                        key={method.id}
                        className={cn(
                          "flex cursor-pointer flex-col gap-2 rounded-xl border p-4 text-sm transition",
                          active ? "border-brand bg-brand/5" : "border-border hover:border-foreground/40",
                        )}
                      >
                        <input type="radio" name="payment" className="sr-only" checked={active} onChange={() => setPayment(method.id)} />
                        <Icon className={cn("h-5 w-5", active ? "text-brand" : "text-muted-foreground")} />
                        <span className="font-semibold">{method.label}</span>
                        <span className="text-xs text-muted-foreground">{method.text}</span>
                      </label>
                    );
                  })}
                </div>

                {payment === "card" ? (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Field label="Card number" htmlFor="card-number" className="sm:col-span-2">
                      <Input id="card-number" inputMode="numeric" placeholder="4242 4242 4242 4242" value={card.number} onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })} autoComplete="cc-number" maxLength={23} className="font-mono tracking-[0.12em]" />
                    </Field>
                    <Field label="Name on card" htmlFor="card-name" className="sm:col-span-2">
                      <Input id="card-name" placeholder={user.name} value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} autoComplete="cc-name" />
                    </Field>
                    <Field label="Expiry" htmlFor="card-expiry">
                      <Input id="card-expiry" placeholder="MM / YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} autoComplete="cc-exp" inputMode="numeric" maxLength={7} className="font-mono" />
                    </Field>
                    <Field label="CVC" htmlFor="card-cvc">
                      <Input id="card-cvc" inputMode="numeric" placeholder="123" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })} autoComplete="cc-csc" maxLength={4} className="font-mono" />
                    </Field>
                  </div>
                ) : payment === "upi" ? (
                  <div className="mt-5">
                    <Field label="UPI ID" htmlFor="upi-id" hint="You'll get a collect request on your UPI app.">
                      <Input id="upi-id" placeholder="name@bank" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                    </Field>
                  </div>
                ) : (
                  <p className="mt-5 rounded-xl bg-accent/40 p-4 text-sm text-muted-foreground dark:bg-accent/20">
                    Pay in cash or by UPI to the courier when your order arrives.
                  </p>
                )}

                <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" />
                  Demo checkout. No payment is taken and no card details are stored.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <Card className="h-fit lg:sticky lg:top-24">
            <CardContent className="space-y-5 p-6">
              <p className="font-display text-2xl">Order summary</p>
              <ul className="divide-y divide-border">
                {cartItems.map((item) => (
                  <li key={item.product.id} className="flex items-center gap-3 py-3 text-sm">
                    <img src={item.product.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                    </div>
                    <span className="font-semibold">{money(item.product.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>

              <div className="flex gap-2">
                <Input
                  placeholder="Coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="h-10 rounded-full uppercase"
                  aria-label="Coupon code"
                />
                <Button type="button" variant="outline" size="sm" className="h-10 rounded-full px-4" onClick={applyCoupon}>
                  Apply
                </Button>
              </div>
              {couponMessage ? (
                <p className={cn("-mt-2 text-xs", coupon ? "text-emerald-700 dark:text-emerald-300" : "text-brand")}>{couponMessage}</p>
              ) : null}

              <div className="space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold">{money(subtotal)}</span></div>
                {discount > 0 ? (
                  <div className="flex justify-between text-emerald-700 dark:text-emerald-300"><span>Discount ({coupon})</span><span className="font-semibold">−{money(discount)}</span></div>
                ) : null}
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-semibold">{shipping === 0 ? "Free" : money(shipping)}</span></div>
                <div className="flex justify-between border-t border-border pt-3 text-base"><span className="font-bold">Total</span><span className="text-xl font-extrabold">{money(total)}</span></div>
              </div>

              {error ? <p className="rounded-lg bg-brand/10 px-3 py-2 text-sm text-brand">{error}</p> : null}

              <Button type="submit" size="lg" className="w-full rounded-full" disabled={placing || !selectedAddress}>
                {placing ? "Placing order…" : `Place order · ${money(total)}`}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                By placing this order you agree to our terms and return policy.
              </p>
            </CardContent>
          </Card>
        </form>
      </div>
    </section>
  );
}
