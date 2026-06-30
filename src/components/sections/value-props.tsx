import { CreditCard, PackageCheck, RefreshCcw, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const items = [
  {
    icon: PackageCheck,
    title: "Fast fulfillment",
    text: "Orders leave the warehouse in under 24 hours.",
    accent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300",
  },
  {
    icon: RefreshCcw,
    title: "Easy returns",
    text: "Hassle-free 30 day returns for every launch drop.",
    accent: "bg-sky-100 text-sky-700 dark:bg-sky-400/15 dark:text-sky-300",
  },
  {
    icon: Shield,
    title: "Protected checkout",
    text: "Secure payment flow with shopper-first confidence.",
    accent: "bg-violet-100 text-violet-700 dark:bg-violet-400/15 dark:text-violet-300",
  },
  {
    icon: CreditCard,
    title: "Flexible payments",
    text: "Offer cards, wallets, and split-pay options later.",
    accent: "bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300",
  },
];

export function ValueProps() {
  return (
    <section id="benefits" className="py-10 sm:py-14">
      <div className="container grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-sm">
              <CardContent className="space-y-4 p-6">
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${item.accent}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
