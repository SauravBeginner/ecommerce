import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Apparel",
    sub: "Knits & layers",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Footwear",
    sub: "Sneakers & shoes",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Accessories",
    sub: "Bags & eyewear",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Wearables",
    sub: "Watches & bands",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Audio",
    sub: "Headphones & buds",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Desk Setup",
    sub: "Lamps & keyboards",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
  },
];

export function CategoryGrid() {
  return (
    <section id="categories" className="py-10 sm:py-14">
      <div className="container">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl sm:text-4xl">
            Shop by <span className="italic text-brand">Category</span>
          </h2>
          <Link to="/shop" className="text-sm font-semibold text-brand hover:underline">
            View all categories →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/shop?category=${encodeURIComponent(category.name)}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-accent/50 shadow-soft"
            >
              <img
                src={category.image}
                alt={category.name}
                className="img-warm absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[hsl(34_45%_94%/0.95)] via-[hsl(34_45%_94%/0.55)] to-transparent dark:from-[hsl(24_20%_10%/0.92)] dark:via-[hsl(24_20%_10%/0.5)]" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-foreground">
                <div>
                  <p className="font-display text-lg leading-tight">{category.name}</p>
                  <p className="text-[11px] text-foreground/70">{category.sub}</p>
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background shadow-sm transition group-hover:bg-brand group-hover:text-brand-foreground">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
