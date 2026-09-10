import { type FormEvent, useEffect, useState } from "react";
import { Check, Heart, LogOut, MapPin, Package, Pencil, Plus, Trash2, UserRound } from "lucide-react";
import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type Address, useAuth } from "@/store/auth";
import { useStorefront } from "@/store/storefront";

const navItems = [
  { label: "Profile", to: "/account", icon: UserRound, end: true },
  { label: "Addresses", to: "/account/addresses", icon: MapPin },
  { label: "Orders", to: "/account/orders", icon: Package },
  { label: "Wishlist", to: "/wishlist", icon: Heart },
];

export function AccountLayout() {
  const { user, signOut, addresses } = useAuth();
  const { wishlistIds } = useStorefront();
  const location = useLocation();

  if (!user) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;

  const initials = user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const counts: Record<string, number> = { "/account/addresses": addresses.length, "/wishlist": wishlistIds.length };

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
          <nav className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
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

/* ---------------- Orders (placeholder) ---------------- */

export function OrdersPage() {
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
