import { type FormEvent, useState } from "react";
import { ArrowRight, Check, Home, Package, PackageSearch, Truck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { PageHero } from "@/components/store/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/store/auth";
import { HelpLinks } from "@/components/store/help-links";

const steps = [
  { icon: Check, title: "Confirmed", text: "We've received your order and sent a confirmation email." },
  { icon: Package, title: "Packed", text: "Picked, checked and boxed at the studio. Usually within 24 hours." },
  { icon: Truck, title: "Shipped", text: "With the courier. Your tracking link goes live at this point." },
  { icon: Home, title: "Delivered", text: "Handed over. 30-day returns start from this day." },
];

export function TrackPage() {
  const { user, orders } = useAuth();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState(user?.email ?? "");
  const [error, setError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const id = orderId.trim().toUpperCase();
    if (!id) return setError("Enter your order number, e.g. EC-A1B2C3.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter the email used for the order.");
    const match = orders.find((order) => order.id === id);
    if (!match || !user || user.email.toLowerCase() !== email.trim().toLowerCase()) {
      return setError("We couldn't find that order for this email. Check the confirmation email, or sign in to see all your orders.");
    }
    setError("");
    navigate(`/order/${match.id}`);
  };

  return (
    <>
      <PageHero eyebrow="Help" title="Track your order" description="Enter your order number and email to see where it is." />
      <section className="pb-16 pt-8 sm:pb-20">
        <div className="container grid gap-8 lg:grid-cols-[1fr_380px]">
          <Card className="h-fit">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2" noValidate>
                <Field label="Order number" htmlFor="track-id" hint="Starts with EC-, found in your confirmation email." >
                  <Input id="track-id" value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="EC-A1B2C3" className="font-mono uppercase" />
                </Field>
                <Field label="Email" htmlFor="track-email">
                  <Input id="track-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
                </Field>
                {error ? <p className="rounded-lg bg-brand/10 px-3 py-2 text-sm text-brand sm:col-span-2">{error}</p> : null}
                <div className="sm:col-span-2">
                  <Button type="submit" size="lg" className="rounded-full px-7">
                    <PackageSearch className="h-4 w-4" />
                    Track order
                  </Button>
                </div>
              </form>

              <div className="mt-8 border-t border-border pt-6">
                <p className="font-display text-xl">How tracking works</p>
                <ol className="mt-4 grid gap-4 sm:grid-cols-4">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <li key={step.title} className="relative">
                        <div className="flex items-center gap-3 sm:flex-col sm:items-start">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                            <Icon className="h-4 w-4" strokeWidth={1.8} />
                          </span>
                          <div>
                            <p className="text-sm font-semibold">
                              <span className="mr-1.5 text-muted-foreground">{index + 1}.</span>
                              {step.title}
                            </p>
                            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{step.text}</p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-5">
          <Card className="h-fit bg-accent/40 dark:bg-accent/20">
            <CardContent className="p-6">
              <p className="font-display text-xl">Signed in?</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                All your orders, with live status, are under My account → Orders. No order number needed.
              </p>
              <Button asChild variant="outline" className="mt-4 rounded-full">
                <Link to={user ? "/account/orders" : "/login?next=%2Faccount%2Forders"}>
                  {user ? "View my orders" : "Sign in"}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <HelpLinks className="lg:static" />
          </div>
        </div>
      </section>
    </>
  );
}
