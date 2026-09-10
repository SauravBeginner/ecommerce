import { type FormEvent, useState } from "react";
import { ArrowRight, Check, Clock, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/store/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/auth";

const topics = ["Order status", "Returns & exchanges", "Product question", "Something else"];

const details = [
  { icon: Mail, title: "Email", lines: ["support@northstar.com"], href: "mailto:support@northstar.com" },
  { icon: Phone, title: "Phone", lines: ["+1 (800) 123-4567"], href: "tel:+18001234567" },
  { icon: Clock, title: "Hours", lines: ["Mon – Fri, 9am – 6pm EST", "We reply within one business day"] },
  { icon: MapPin, title: "Studio", lines: ["12 Northstar Lane", "Brooklyn, NY 11201"] },
];

const faqs = [
  { q: "Where is my order?", a: "Sign in and open My account → Orders for live status and tracking." },
  { q: "How do returns work?", a: "Free returns within 30 days, in original condition. Start one from your order page." },
  { q: "Do you ship internationally?", a: "Yes, to 40+ countries. Duties are calculated at checkout so there are no surprises." },
];

export function ContactPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name ?? "", email: user?.email ?? "", topic: topics[0], message: "" });
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim()) return setError("Tell us your name.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Enter a valid email so we can reply.");
    if (form.message.trim().length < 10) return setError("Add a little more detail so we can help.");
    setError("");
    setSent(true);
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We're here to help"
        description="Questions about an order, a product, or a return? Send a note and a real person will get back to you."
      />
      <section className="pb-16 pt-8 sm:pb-20">
        <div className="container grid gap-8 lg:grid-cols-[1fr_380px]">
          <Card>
            <CardContent className="p-6 sm:p-8">
              {sent ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-brand-foreground">
                    <Check className="h-6 w-6" strokeWidth={3} />
                  </span>
                  <h2 className="mt-5 font-display text-3xl">Message sent</h2>
                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    Thanks, {form.name.split(" ")[0]}. We've emailed a copy to {form.email} and will reply within one business day.
                  </p>
                  <Button asChild className="mt-6 rounded-full">
                    <Link to="/shop">
                      Continue shopping
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2" noValidate>
                  <h2 className="font-display text-2xl sm:col-span-2">Send us a message</h2>
                  <Field label="Name" htmlFor="c-name">
                    <Input id="c-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" />
                  </Field>
                  <Field label="Email" htmlFor="c-email">
                    <Input id="c-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
                  </Field>
                  <div className="space-y-2 sm:col-span-2">
                    <p className="text-sm font-semibold">What's it about?</p>
                    <div className="flex flex-wrap gap-2">
                      {topics.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => setForm({ ...form, topic })}
                          className={cn(
                            "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                            form.topic === topic ? "border-brand bg-brand text-brand-foreground" : "border-border bg-card hover:border-foreground/40",
                          )}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Field label="Message" htmlFor="c-message" className="sm:col-span-2" hint="Include your order number if you have one.">
                    <textarea
                      id="c-message"
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="flex w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="How can we help?"
                    />
                  </Field>
                  {error ? <p className="rounded-lg bg-brand/10 px-3 py-2 text-sm text-brand sm:col-span-2">{error}</p> : null}
                  <div className="sm:col-span-2">
                    <Button type="submit" size="lg" className="rounded-full px-7">
                      Send message
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="space-y-5">
            <Card>
              <CardContent className="space-y-4 p-6">
                {details.map((item) => {
                  const Icon = item.icon;
                  const body = (
                    <>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                        <Icon className="h-4 w-4" strokeWidth={1.8} />
                      </span>
                      <span className="min-w-0 text-sm">
                        <span className="block font-semibold">{item.title}</span>
                        {item.lines.map((line) => (
                          <span key={line} className="block leading-6 text-muted-foreground">{line}</span>
                        ))}
                      </span>
                    </>
                  );
                  return item.href ? (
                    <a key={item.title} href={item.href} className="flex gap-3 rounded-xl transition hover:text-brand">{body}</a>
                  ) : (
                    <div key={item.title} className="flex gap-3">{body}</div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-accent/40 dark:bg-accent/20">
              <CardContent className="p-6">
                <p className="font-display text-xl">Quick answers</p>
                <dl className="mt-4 space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.q}>
                      <dt className="text-sm font-semibold">{faq.q}</dt>
                      <dd className="mt-1 text-sm leading-6 text-muted-foreground">{faq.a}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
