import { Headphones, LampDesk, Shirt, Watch } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    name: "Wearables",
    icon: Watch,
    accent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
    border: "border-l-4 border-l-emerald-400",
    gradient: "from-emerald-50/70 to-transparent dark:from-emerald-500/5",
    query: "Wearables",
  },
  {
    name: "Apparel",
    icon: Shirt,
    accent: "bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300",
    border: "border-l-4 border-l-sky-400",
    gradient: "from-sky-50/70 to-transparent dark:from-sky-500/5",
    query: "Apparel",
  },
  {
    name: "Desk Setup",
    icon: LampDesk,
    accent: "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
    border: "border-l-4 border-l-amber-400",
    gradient: "from-amber-50/70 to-transparent dark:from-amber-500/5",
    query: "Desk Setup",
  },
  {
    name: "Audio",
    icon: Headphones,
    accent: "bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300",
    border: "border-l-4 border-l-rose-400",
    gradient: "from-rose-50/70 to-transparent dark:from-rose-500/5",
    query: "Audio",
  },
];

export function CategoryGrid() {
  return (
    <section id="categories" className="border-y border-border/70 bg-muted/35 py-10 sm:py-14">
      <div className="container">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Categories
            </p>
            <h2 className="mt-2 text-3xl font-extrabold">
              Explore by collection
            </h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.name} to={`/shop?category=${encodeURIComponent(category.query)}`}>
                <Card className={`overflow-hidden transition duration-200 hover:-translate-y-1 hover:shadow-md ${category.border}`}>
                  <CardContent className={`flex items-center justify-between bg-gradient-to-r p-6 ${category.gradient}`}>
                    <div>
                      <p className="text-lg font-bold">{category.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">Fresh arrivals weekly</p>
                    </div>
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-xl ${category.accent}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
