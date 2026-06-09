import { CreditCard, PackageCheck, RefreshCcw, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const items = [
  {
    icon: PackageCheck,
    title: "Fast fulfillment",
    text: "Orders leave the warehouse in under 24 hours.",
  },
  {
    icon: RefreshCcw,
    title: "Easy returns",
    text: "Hassle-free 30 day returns for every launch drop.",
  },
  {
    icon: Shield,
    title: "Protected checkout",
    text: "Secure payment flow with shopper-first confidence.",
  },
  {
    icon: CreditCard,
    title: "Flexible payments",
    text: "Offer cards, wallets, and split-pay options later.",
  },
];

export function ValueProps() {
  return (
    <section id="benefits" className="py-10 sm:py-14">
      <div className="container grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="transition duration-200 hover:-translate-y-1 hover:border-primary/40">
              <CardContent className="space-y-4 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/12 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
