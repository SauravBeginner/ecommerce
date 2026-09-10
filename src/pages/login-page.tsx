import { type FormEvent, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Lock } from "lucide-react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/auth";

type Mode = "signin" | "signup";

const perks = [
  "Faster checkout with saved addresses",
  "Order history and easy returns",
  "Wishlist synced across devices",
  "Early access to new drops",
  "Member-only offers and codes",
  "Birthday treat every year",
  "Free shipping on every order over $120",
  "Priority support, real people",
  "Free gift wrapping on request",
];

export function LoginPage() {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next") ?? "/account";
  const [mode, setMode] = useState<Mode>(searchParams.get("mode") === "signup" ? "signup" : "signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [optIn, setOptIn] = useState(true);
  const [error, setError] = useState("");

  if (user) return <Navigate to={next} replace />;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (mode === "signup" && !name.trim()) return setError("Tell us your name.");
    setError("");
    if (mode === "signup") signUp(name, email, optIn);
    else signIn(email);
    navigate(next, { replace: true });
  };

  return (
    <section className="py-10 sm:py-16">
      <div className="container grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
        {/* Brand panel */}
        <div className="relative hidden overflow-hidden rounded-3xl bg-accent/50 p-10 dark:bg-accent/20 lg:block lg:min-h-[600px]">
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full bg-brand/80" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">Northstar members</p>
            <h2 className="mt-4 font-display text-5xl leading-[1.02]">
              Good things,
              <br />
              <span className="italic text-brand">saved for you.</span>
            </h2>
            <ul className="mt-7 max-w-[52%] space-y-2.5">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-3 text-sm text-foreground/80">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand/15 text-brand">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>
          <img
            src="https://images.unsplash.com/photo-1581338834647-b0fb40704e21?auto=format&fit=crop&w=900&q=80"
            alt=""
            className="absolute bottom-0 right-0 h-[54%] w-[46%] rounded-tl-[120px] object-cover object-top"
          />
        </div>

        {/* Form */}
        <div className="mx-auto w-full max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">
            {mode === "signin" ? "Welcome back" : "Join Northstar"}
          </p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">
            {mode === "signin" ? "Sign in" : "Create account"}
          </h1>

          <div className="mt-6 grid grid-cols-2 rounded-full border border-border bg-card p-1 text-sm font-semibold">
            {(["signin", "signup"] as Mode[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => { setMode(value); setError(""); }}
                className={cn(
                  "rounded-full py-2 transition",
                  mode === value ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {value === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
            {mode === "signup" ? (
              <Field label="Full name" htmlFor="name">
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Aarav Mehta" autoComplete="name" />
              </Field>
            ) : null}
            <Field label="Email" htmlFor="email">
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
            </Field>
            <Field label="Password" htmlFor="password" hint={mode === "signup" ? "At least 6 characters." : undefined}>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete={mode === "signup" ? "new-password" : "current-password"} />
            </Field>

            {mode === "signup" ? (
              <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
                <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[hsl(var(--brand))]" />
                Send me early access to drops and member offers. One email a week, unsubscribe any time.
              </label>
            ) : (
              <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
                  <input type="checkbox" defaultChecked className="h-4 w-4 accent-[hsl(var(--brand))]" />
                  Keep me signed in
                </label>
                <button type="button" className="font-semibold text-brand hover:underline">Forgot password?</button>
              </div>
            )}

            {error ? <p className="rounded-lg bg-brand/10 px-3 py-2 text-sm text-brand">{error}</p> : null}

            <Button type="submit" size="lg" className="w-full rounded-full">
              {mode === "signin" ? "Sign in" : "Create account"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            Demo account area. Details are stored only in this browser.
          </p>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "New here? " : "Already a member? "}
            <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="font-semibold text-brand hover:underline">
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
          <Link
            to="/shop"
            className="mt-3 flex items-center justify-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Continue shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
