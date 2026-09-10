import { type FormEvent, useEffect, useState } from "react";
import { Check, CreditCard, LogOut, MapPin, Package, Pencil, Plus, Smartphone, Trash2, UserRound } from "lucide-react";
import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type Address, useAuth } from "@/store/auth";
import { cardBrand, formatCardNumber, formatExpiry, isValidUpi } from "@/lib/pricing";

const navItems = [
  { label: "Profile", to: "/account", icon: UserRound, end: true },
  { label: "Addresses", to: "/account/addresses", icon: MapPin },
  { label: "Payment methods", to: "/account/payments", icon: CreditCard },
  { label: "Orders", to: "/account/orders", icon: Package },
];

export function AccountLayout() {
  const { user, signOut, addresses, orders, paymentMethods } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;

  const initials = user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const counts: Record<string, number> = { "/account/addresses": addresses.length, "/account/payments": paymentMethods.length, "/account/orders": orders.length };

  return (
    <section className="pb-16 pt-8 sm:pb-20 sm:pt-10">
      <div className="container">
        <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/15 font-display text-2xl text-brand">
              {initials}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">My account</p>
              <h1 className="mt-1 font-display text-3xl sm:text-4xl">{user.name}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button variant="outline" className="rounded-full" onClick={signOut}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
          <nav className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      "flex shrink-0 items-center justify-between gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition lg:rounded-lg",
                      isActive ? "bg-foreground text-background" : "bg-card text-foreground hover:bg-accent/60 lg:bg-transparent",
                    )
                  }
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                    {item.label}
                  </span>
                  {counts[item.to] !== undefined ? <span className="text-xs opacity-70">{counts[item.to]}</span> : null}
                </NavLink>
              );
            })}
          </nav>
          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Profile ---------------- */

export function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [optIn, setOptIn] = useState(user?.marketingOptIn ?? false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const id = window.setTimeout(() => setSaved(false), 2500);
    return () => window.clearTimeout(id);
  }, [saved]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    updateProfile({ name: name.trim() || user?.name, phone, marketingOptIn: optIn });
    setSaved(true);
  };

  return (
    <Card>
      <CardContent className="p-6 sm:p-8">
        <h2 className="font-display text-2xl">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">How we address you and how we reach you.</p>
        <form onSubmit={submit} className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="profile-name">
            <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </Field>
          <Field label="Email" htmlFor="profile-email" hint="Used for sign in and order updates.">
            <Input id="profile-email" value={user?.email ?? ""} readOnly className="bg-muted/60" />
          </Field>
          <Field label="Phone" htmlFor="profile-phone" hint="For delivery updates only." className="sm:col-span-2">
            <Input id="profile-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" autoComplete="tel" />
          </Field>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-accent/30 p-4 text-sm sm:col-span-2 dark:bg-accent/15">
            <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[hsl(var(--brand))]" />
            <span>
              <span className="font-semibold">Member offers</span>
              <span className="block text-muted-foreground">Early access to drops and seasonal edits. One email a week.</span>
            </span>
          </label>
          <div className="flex items-center gap-3 sm:col-span-2">
            <Button type="submit" className="rounded-full px-6">Save changes</Button>
            {saved ? (
              <span className="inline-flex items-center gap-1.5 text-sm text-brand">
                <Check className="h-4 w-4" /> Saved
              </span>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

/* ---------------- Addresses ---------------- */

const emptyAddress: Omit<Address, "id"> = {
  label: "Home",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

export function AddressesPage() {
  const { user, addresses, saveAddress, removeAddress, setDefaultAddress } = useAuth();
  const [editing, setEditing] = useState<(Omit<Address, "id"> & { id?: string }) | null>(null);
  const [error, setError] = useState("");

  const startNew = () => setEditing({ ...emptyAddress, fullName: user?.name ?? "", phone: user?.phone ?? "", isDefault: addresses.length === 0 });

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!editing) return;
    const required: (keyof typeof editing)[] = ["fullName", "phone", "line1", "city", "state", "postalCode"];
    if (required.some((key) => !String(editing[key]).trim())) return setError("Please fill in all required fields.");
    setError("");
    saveAddress(editing);
    setEditing(null);
  };

  const set = (key: keyof Omit<Address, "id">, value: string | boolean) =>
    setEditing((current) => (current ? { ...current, [key]: value } : current));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl">Shipping addresses</h2>
          <p className="mt-1 text-sm text-muted-foreground">Your default address is used at checkout.</p>
        </div>
        {!editing ? (
          <Button className="rounded-full" onClick={startNew}>
            <Plus className="h-4 w-4" />
            Add address
          </Button>
        ) : null}
      </div>

      {editing ? (
        <Card>
          <CardContent className="p-6 sm:p-8">
            <h3 className="text-lg font-bold">{editing.id ? "Edit address" : "New address"}</h3>
            <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2" noValidate>
              <Field label="Label" htmlFor="addr-label" hint="Home, Office, Parents…">
                <Input id="addr-label" value={editing.label} onChange={(e) => set("label", e.target.value)} />
              </Field>
              <Field label="Full name *" htmlFor="addr-name">
                <Input id="addr-name" value={editing.fullName} onChange={(e) => set("fullName", e.target.value)} autoComplete="name" />
              </Field>
              <Field label="Phone *" htmlFor="addr-phone">
                <Input id="addr-phone" value={editing.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" />
              </Field>
              <Field label="Country" htmlFor="addr-country">
                <Input id="addr-country" value={editing.country} onChange={(e) => set("country", e.target.value)} autoComplete="country-name" />
              </Field>
              <Field label="Address line 1 *" htmlFor="addr-line1" className="sm:col-span-2">
                <Input id="addr-line1" value={editing.line1} onChange={(e) => set("line1", e.target.value)} placeholder="Flat, house no., building" autoComplete="address-line1" />
              </Field>
              <Field label="Address line 2" htmlFor="addr-line2" className="sm:col-span-2">
                <Input id="addr-line2" value={editing.line2} onChange={(e) => set("line2", e.target.value)} placeholder="Area, street, landmark" autoComplete="address-line2" />
              </Field>
              <Field label="City *" htmlFor="addr-city">
                <Input id="addr-city" value={editing.city} onChange={(e) => set("city", e.target.value)} autoComplete="address-level2" />
              </Field>
              <Field label="State *" htmlFor="addr-state">
                <Input id="addr-state" value={editing.state} onChange={(e) => set("state", e.target.value)} autoComplete="address-level1" />
              </Field>
              <Field label="PIN / Postal code *" htmlFor="addr-postal">
                <Input id="addr-postal" value={editing.postalCode} onChange={(e) => set("postalCode", e.target.value)} autoComplete="postal-code" />
              </Field>
              <label className="flex cursor-pointer items-center gap-3 self-end pb-3 text-sm">
                <input type="checkbox" checked={editing.isDefault} onChange={(e) => set("isDefault", e.target.checked)} className="h-4 w-4 accent-[hsl(var(--brand))]" />
                Set as default address
              </label>
              {error ? <p className="rounded-lg bg-brand/10 px-3 py-2 text-sm text-brand sm:col-span-2">{error}</p> : null}
              <div className="flex gap-3 sm:col-span-2">
                <Button type="submit" className="rounded-full px-6">Save address</Button>
                <Button type="button" variant="outline" className="rounded-full" onClick={() => { setEditing(null); setError(""); }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {addresses.length === 0 && !editing ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
              <MapPin className="h-5 w-5" />
            </span>
            <p className="font-display text-xl">No addresses yet</p>
            <p className="max-w-sm text-sm text-muted-foreground">Add a shipping address to speed up checkout next time.</p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((address) => (
          <Card key={address.id} className={cn(address.isDefault && "border-brand/50")}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold">{address.label}</span>
                  {address.isDefault ? <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">Default</span> : null}
                </div>
                <div className="flex gap-1">
                  <button type="button" className="rounded-full p-2 text-muted-foreground hover:bg-accent/60 hover:text-foreground" aria-label="Edit address" onClick={() => setEditing(address)}>
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button type="button" className="rounded-full p-2 text-muted-foreground hover:bg-accent/60 hover:text-brand" aria-label="Delete address" onClick={() => removeAddress(address.id)}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="mt-3 font-semibold">{address.fullName}</p>
              <p className="text-sm leading-6 text-muted-foreground">
                {address.line1}
                {address.line2 ? <>, {address.line2}</> : null}
                <br />
                {address.city}, {address.state} {address.postalCode}
                <br />
                {address.country} · {address.phone}
              </p>
              {!address.isDefault ? (
                <button type="button" className="mt-3 text-sm font-semibold text-brand hover:underline" onClick={() => setDefaultAddress(address.id)}>
                  Make default
                </button>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Payment methods ---------------- */

export function PaymentsPage() {
  const { user, paymentMethods, savePaymentMethod, updatePaymentMethod, removePaymentMethod, setDefaultPaymentMethod } = useAuth();
  const [mode, setMode] = useState<"card" | "upi" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = paymentMethods.find((m) => m.id === editingId) ?? null;
  const [card, setCard] = useState({ number: "", holder: user?.name ?? "", expiry: "" });
  const [upi, setUpi] = useState("");
  const [makeDefault, setMakeDefault] = useState(false);
  const [error, setError] = useState("");

  const reset = () => { setMode(null); setEditingId(null); setCard({ number: "", holder: user?.name ?? "", expiry: "" }); setUpi(""); setMakeDefault(false); setError(""); };

  const startEdit = (id: string) => {
    const method = paymentMethods.find((m) => m.id === id);
    if (!method) return;
    setEditingId(id);
    setMode(method.type);
    setMakeDefault(method.isDefault);
    if (method.type === "card") setCard({ number: "", holder: method.holder ?? "", expiry: method.expiry ?? "" });
    else setUpi(method.upiId ?? "");
    setError("");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (editing) {
      if (editing.type === "card") {
        if (!card.holder.trim() || card.expiry.replace(/\D/g, "").length !== 4) return setError("Enter the name and expiry.");
        updatePaymentMethod(editing.id, { holder: card.holder.trim(), expiry: card.expiry, isDefault: makeDefault });
      } else {
        if (!isValidUpi(upi)) return setError("Enter a valid UPI ID, e.g. name@bank.");
        updatePaymentMethod(editing.id, { upiId: upi.trim(), label: upi.trim(), isDefault: makeDefault });
      }
      reset();
      return;
    }
    if (mode === "card") {
      const digits = card.number.replace(/\D/g, "");
      if (digits.length < 12 || !card.holder.trim() || card.expiry.replace(/\D/g, "").length !== 4) return setError("Enter the card number, name and expiry.");
      const brand = cardBrand(digits);
      savePaymentMethod({ type: "card", brand, last4: digits.slice(-4), expiry: card.expiry, holder: card.holder.trim(), label: `${brand} •••• ${digits.slice(-4)}`, isDefault: makeDefault });
    } else if (mode === "upi") {
      if (!isValidUpi(upi)) return setError("Enter a valid UPI ID, e.g. name@bank.");
      savePaymentMethod({ type: "upi", upiId: upi.trim(), label: upi.trim(), isDefault: makeDefault });
    }
    reset();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl">Payment methods</h2>
          <p className="mt-1 text-sm text-muted-foreground">Your default method is preselected at checkout.</p>
        </div>
        {!mode ? (
          <div className="flex gap-2">
            <Button className="rounded-full" onClick={() => setMode("card")}>
              <Plus className="h-4 w-4" />
              Add card
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => setMode("upi")}>
              <Plus className="h-4 w-4" />
              Add UPI
            </Button>
          </div>
        ) : null}
      </div>

      {mode ? (
        <Card>
          <CardContent className="p-6 sm:p-8">
            <h3 className="text-lg font-bold">{editing ? (editing.type === "card" ? `Edit ${editing.label}` : "Edit UPI ID") : mode === "card" ? "New card" : "New UPI ID"}</h3>
            <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2" noValidate>
              {mode === "card" ? (
                <>
                  <Field label="Card number" htmlFor="pm-number" className="sm:col-span-2" hint={editing ? "Card numbers can't be changed. Add a new card instead." : "Only the last four digits are kept. CVV is never stored; you enter it at checkout."}>
                    <Input id="pm-number" inputMode="numeric" placeholder="4242 4242 4242 4242" value={editing ? `•••• •••• •••• ${editing.last4}` : card.number} onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })} maxLength={23} className="font-mono tracking-[0.12em]" autoComplete="cc-number" readOnly={Boolean(editing)} disabled={Boolean(editing)} />
                  </Field>
                  <Field label="Name on card" htmlFor="pm-holder">
                    <Input id="pm-holder" value={card.holder} onChange={(e) => setCard({ ...card, holder: e.target.value })} autoComplete="cc-name" />
                  </Field>
                  <Field label="Expiry" htmlFor="pm-expiry">
                    <Input id="pm-expiry" placeholder="MM / YY" inputMode="numeric" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} maxLength={7} className="font-mono" autoComplete="cc-exp" />
                  </Field>
                </>
              ) : (
                <Field label="UPI ID" htmlFor="pm-upi" className="sm:col-span-2" hint="We'll send a collect request to this ID at checkout.">
                  <Input id="pm-upi" placeholder="name@bank" value={upi} onChange={(e) => setUpi(e.target.value)} />
                </Field>
              )}
              <label className="flex cursor-pointer items-center gap-3 text-sm sm:col-span-2">
                <input type="checkbox" checked={makeDefault} onChange={(e) => setMakeDefault(e.target.checked)} className="h-4 w-4 accent-[hsl(var(--brand))]" />
                Set as default payment method
              </label>
              {error ? <p className="rounded-lg bg-brand/10 px-3 py-2 text-sm text-brand sm:col-span-2">{error}</p> : null}
              <div className="flex gap-3 sm:col-span-2">
                <Button type="submit" className="rounded-full px-6">{editing ? "Save changes" : "Save"}</Button>
                <Button type="button" variant="outline" className="rounded-full" onClick={reset}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {paymentMethods.length === 0 && !mode ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
              <CreditCard className="h-5 w-5" />
            </span>
            <p className="font-display text-xl">No payment methods yet</p>
            <p className="max-w-sm text-sm text-muted-foreground">Save a card or UPI ID to check out faster next time.</p>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {paymentMethods.map((method) => {
          const Icon = method.type === "card" ? CreditCard : Smartphone;
          return (
            <Card key={method.id} className={cn(method.isDefault && "border-brand/50")}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="font-semibold">{method.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {method.type === "card" ? `${method.holder} · Expires ${method.expiry}` : "UPI"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button type="button" className="rounded-full p-2 text-muted-foreground hover:bg-accent/60 hover:text-foreground" aria-label="Edit payment method" onClick={() => startEdit(method.id)}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" className="rounded-full p-2 text-muted-foreground hover:bg-accent/60 hover:text-brand" aria-label="Remove payment method" onClick={() => removePaymentMethod(method.id)}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  {method.isDefault ? (
                    <span className="rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">Default</span>
                  ) : (
                    <button type="button" className="text-sm font-semibold text-brand hover:underline" onClick={() => setDefaultPaymentMethod(method.id)}>
                      Make default
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Orders ---------------- */

export function OrdersPage() {
  const { orders } = useAuth();

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Package className="h-5 w-5" />
          </span>
          <p className="font-display text-xl">No orders yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">When you place an order it will appear here with tracking and easy returns.</p>
          <Button asChild className="mt-2 rounded-full">
            <NavLink to="/shop">Start shopping</NavLink>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-2xl">Orders</h2>
        <p className="mt-1 text-sm text-muted-foreground">{orders.length} order{orders.length === 1 ? "" : "s"} placed.</p>
      </div>
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{order.id}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.placedAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })} · {order.items.reduce((sum, item) => sum + item.quantity, 0)} items · {order.payment.label}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">{order.status}</span>
                <span className="font-bold">${order.total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {order.items.slice(0, 5).map((item) => (
                <img key={item.productId} src={item.image} alt={item.name} title={item.name} className="h-12 w-12 rounded-lg border-2 border-card object-cover" />
              ))}
              {order.items.length > 5 ? <span className="text-xs text-muted-foreground">+{order.items.length - 5}</span> : null}
              <NavLink to={`/order/${order.id}`} className="ml-auto text-sm font-semibold text-brand hover:underline">
                View details →
              </NavLink>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
