import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const banners = [
  {
    eyebrow: "Limited time",
    title: "Up to 50% off",
    text: "On selected styles",
    cta: "Shop now",
    to: "/shop?sale=true",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=80",
  },
  {
    eyebrow: "New arrivals",
    title: "Fresh styles just dropped",
    text: "Be the first to wear the season",
    cta: "Discover now",
    to: "/shop?new=true",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=80",
  },
];

export function PromoBanners() {
  return (
    <section className="py-10 sm:py-14">
      <div className="container">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">Popular <span className="italic text-brand">picks</span></h2>
          <Link to="/shop" className="text-sm font-semibold text-foreground/70 hover:text-foreground">
            View all →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {banners.map((banner) => (
            <div
              key={banner.title}
              className="group relative min-h-[280px] overflow-hidden rounded-2xl bg-accent shadow-soft"
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="img-warm absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(34_45%_92%)] via-[hsl(34_45%_92%/0.75)] to-transparent dark:from-[hsl(24_15%_10%)] dark:via-[hsl(24_15%_10%/0.7)]" />
              <div className="relative flex h-full flex-col justify-center gap-3 p-8 sm:p-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
                  {banner.eyebrow}
                </p>
                <h3 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">
                  {banner.title}
                </h3>
                <p className="text-sm text-foreground/70">{banner.text}</p>
                <Button asChild size="sm" className="mt-3 w-fit rounded-full">
                  <Link to={banner.to}>
                    {banner.cta}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
