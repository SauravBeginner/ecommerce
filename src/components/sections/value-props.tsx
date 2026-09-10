import { Headset, RefreshCcw, Shield, Truck } from "lucide-react";

const items = [
  { icon: Truck, title: "Free shipping", text: "On orders above $120" },
  { icon: RefreshCcw, title: "Easy returns", text: "30-day return policy" },
  { icon: Shield, title: "Secure payment", text: "100% protected checkout" },
  { icon: Headset, title: "24/7 support", text: "We are here to help" },
];

export function ValueProps() {
  return (
    <section id="benefits" className="relative z-10 -mt-6 lg:-mt-12">
      <div className="container">
        <div className="grid divide-y divide-border rounded-2xl border border-border bg-card shadow-soft sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="flex items-center gap-4 px-6 py-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/70 text-foreground dark:bg-accent">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <div>
                  <p className="text-sm font-bold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
