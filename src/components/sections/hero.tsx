import { useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const slides = [
  {
    eyebrow: "New collection 2026",
    title: "Timeless",
    accent: "Elegance",
    text: "Minimal designs. Maximum impact. Redefine your everyday with apparel, audio, and desk pieces that speak sophistication.",
    cta: { label: "Explore collection", to: "/shop" },
    image: "https://images.unsplash.com/photo-1571513722275-4b41940f54b8?auto=format&fit=crop&w=1000&q=85",
  },
  {
    eyebrow: "Menswear edit",
    title: "Tailored",
    accent: "Comfort",
    text: "Blazers, knits and clean sneakers in warm neutrals. Sharp enough for the office, easy enough for the weekend.",
    cta: { label: "Shop apparel", to: "/shop?category=Apparel" },
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1000&q=85",
  },
  {
    eyebrow: "For every generation",
    title: "Season",
    accent: "Sale",
    text: "Up to 30% off selected pieces across the edit. Style has no age limit, and neither does a good deal.",
    cta: { label: "Shop the sale", to: "/shop?sale=true" },
    image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=1000&q=85",
  },
];

const INTERVAL = 5500;

const reviewers = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=70",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&h=80&q=70",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=80&h=80&q=70",
];

export function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const touchStart = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const slide = slides[index];

  // Only auto-advance while the hero is actually on screen (matters on mobile, where it scrolls away quickly)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !visible) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), INTERVAL);
    return () => window.clearInterval(id);
  }, [paused, visible, index]);

  const go = (next: number) => setIndex((next + slides.length) % slides.length);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden pb-16 pt-8 sm:pt-12 lg:pb-24 lg:pt-14"
    >
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Copy */}
          <div className="relative z-10">
            <div key={index} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">{slide.eyebrow}</p>
              <h1 className="mt-4 font-display text-6xl leading-[0.95] text-foreground sm:text-7xl lg:text-8xl">
                {slide.title}
                <br />
                <span className="italic text-brand">{slide.accent}</span>
              </h1>
            </div>

            {/* Slide markers */}
            <div className="mt-6 flex items-center gap-3" role="tablist" aria-label="Hero slides">
              {slides.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Slide ${i + 1}: ${s.title} ${s.accent}`}
                  onClick={() => go(i)}
                  className={cn(
                    "flex items-center gap-2 text-xs font-semibold tracking-[0.2em] transition-colors",
                    i === index ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  0{i + 1}
                  <span
                    className={cn(
                      "block h-px bg-brand transition-all duration-500",
                      i === index ? "w-8" : "w-0",
                    )}
                  />
                </button>
              ))}
            </div>

            <p key={`text-${index}`} className="mt-5 max-w-md animate-in fade-in text-base leading-7 text-muted-foreground duration-500 sm:text-lg">
              {slide.text}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link to={slide.cta.to}>
                  {slide.cta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-foreground/25 bg-transparent px-6 hover:bg-foreground hover:text-background"
              >
                <Link to="/shop?new=true">
                  <Sparkles className="h-3.5 w-3.5" />
                  See what's new
                </Link>
              </Button>
            </div>

            {/* Social proof pill */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-border bg-card py-2 pl-2 pr-5 shadow-soft">
              <div className="flex -space-x-2">
                {reviewers.map((src) => (
                  <img key={src} src={src} alt="" className="h-8 w-8 rounded-full border-2 border-card object-cover" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-brand">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-current" />
                  ))}
                  <span className="ml-1 text-xs font-bold text-foreground">4.8</span>
                </div>
                <p className="text-[11px] text-muted-foreground">2,450+ reviews</p>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div
            className="relative mx-auto w-full max-w-[520px] touch-pan-y"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchStart.current === null) return;
              const delta = e.changedTouches[0].clientX - touchStart.current;
              if (Math.abs(delta) > 40) go(index + (delta < 0 ? 1 : -1));
              touchStart.current = null;
            }}
          >
            <div className="absolute -right-6 top-4 h-[88%] w-[88%] rounded-full bg-brand/90" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[999px_999px_32px_32px] border-[6px] border-background shadow-soft">
              {slides.map((s, i) => (
                <img
                  key={s.image}
                  src={s.image}
                  alt={`${s.title} ${s.accent}`}
                  className={cn(
                    "absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-1000 ease-in-out",
                    i === index ? "opacity-100" : "opacity-0",
                  )}
                  loading="eager"
                />
              ))}
            </div>

            <div className="absolute -left-4 top-16 flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold shadow-soft">
              <span className="h-2 w-2 rounded-full bg-brand" />
              Quality assured
            </div>
            <div className="absolute -right-2 bottom-16 flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold shadow-soft">
              <span className="h-2 w-2 rounded-full bg-brand" />
              Premium
            </div>

            <div className="absolute -left-6 bottom-10 hidden flex-col gap-3 sm:flex">
              <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-soft">
                <p className="font-display text-2xl">10K+</p>
                <p className="text-[11px] text-muted-foreground">Happy customers</p>
              </div>
              <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-soft">
                <p className="font-display text-2xl">4.9</p>
                <p className="text-[11px] text-muted-foreground">Customer rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
