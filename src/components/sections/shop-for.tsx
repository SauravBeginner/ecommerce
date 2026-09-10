import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const audiences = [
  {
    label: "Women",
    title: "The women's edit",
    text: "Knits, bags, watches and the season's sneakers.",
    to: "/shop?for=women",
    position: "center 30%",
    image: "https://images.unsplash.com/photo-1554141220-83411835a60b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Men",
    title: "The men's edit",
    text: "Tailoring, overshirts, carry goods and clean trainers.",
    to: "/shop?for=men",
    position: "center 12%",
    image: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?auto=format&fit=crop&w=1200&q=80",
  },
];

export function ShopFor() {
  return (
    <section className="py-10 sm:py-14">
      <div className="container">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl sm:text-4xl">
            Shop <span className="italic text-brand">for</span>
          </h2>
          <Link to="/shop" className="text-sm font-semibold text-brand hover:underline">
            Everyone →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {audiences.map((audience) => (
            <Link
              key={audience.label}
              to={audience.to}
              className="group relative block aspect-[16/11] overflow-hidden rounded-2xl bg-accent/40 shadow-soft sm:aspect-[16/9]"
            >
              <img
                src={audience.image}
                alt={audience.title}
                style={{ objectPosition: audience.position }}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[hsl(34_45%_94%/0.96)] via-[hsl(34_45%_94%/0.55)] to-transparent dark:from-[hsl(24_20%_10%/0.94)] dark:via-[hsl(24_20%_10%/0.5)]" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-8">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">{audience.label}</p>
                  <p className="mt-1 font-display text-2xl leading-tight sm:text-3xl">{audience.title}</p>
                  <p className="mt-1 text-sm text-foreground/70">{audience.text}</p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition group-hover:bg-brand group-hover:text-brand-foreground">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
