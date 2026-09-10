import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHero } from "@/components/store/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpLinks } from "@/components/store/help-links";

const values = [
  { title: "Fewer, better things", text: "We stock 84 pieces, not 7,000. Each one earns its place on quality, wearability and price." },
  { title: "Made to last", text: "Full-grain leather, organic cotton, sapphire glass. Materials chosen so the piece looks better at year three than day one." },
  { title: "Honest pricing", text: "One fair price all year. Sales are real markdowns on real stock, never inflated then discounted." },
  { title: "Real people", text: "A small studio team in Brooklyn answers every message. No bots, no scripts." },
];

const stats = [
  { value: "2019", label: "Founded" },
  { value: "10K+", label: "Happy customers" },
  { value: "40+", label: "Independent labels" },
  { value: "4.9", label: "Average rating" },
];

export function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About us" title="Our story" description="A small edit of apparel, footwear, audio and desk pieces for people who would rather buy once." />
      <section className="pb-16 pt-8 sm:pb-20">
        <div className="container grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0 space-y-8">
          <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-center">
            <div className="overflow-hidden rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80"
                alt="Inside the Ecom studio"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">Since 2019</p>
              <h2 className="mt-2 font-display text-2xl leading-snug sm:text-3xl">One rule: no filler.</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                We began in a Brooklyn studio as a tiny shop selling six things we couldn't find anywhere else at a fair price. Seven years on, the shelves hold eighty-four, chosen the same way: would we buy this ourselves, and would we still be wearing it in three years?
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Every product is worn, tested and photographed by the team before it goes live. If something doesn't hold up, it comes off the site.
              </p>
              <Button asChild className="mt-6 rounded-full">
                <Link to="/shop">
                  Browse the edit
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 rounded-2xl border border-border bg-accent/40 p-6 dark:bg-accent/20 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {values.map((value) => (
              <Card key={value.title}>
                <CardContent className="p-6">
                  <p className="font-display text-xl">{value.title}</p>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{value.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <HelpLinks />
        </div>
      </section>
    </>
  );
}
