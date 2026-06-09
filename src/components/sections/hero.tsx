import { ArrowRight, ShieldCheck, Truck, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[calc(100svh-4rem)] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=85"
        alt="Northstar fashion and essentials collection"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/82 via-black/50 to-black/18" />
      <div className="container relative flex min-h-[calc(100svh-4rem)] items-end pb-14 pt-20">
        <div className="max-w-2xl space-y-7 text-white">
          <Badge className="bg-white text-slate-950">Summer collection</Badge>
          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold sm:text-6xl lg:text-7xl">
              Northstar essentials
            </h1>
            <p className="max-w-xl text-base leading-7 text-white/85 sm:text-lg">
              Apparel, audio, carry goods, and desk pieces selected for sharper daily routines.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/shop">
                Shop collection
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-slate-950">
              <Link to="/wishlist">View saved picks</Link>
            </Button>
          </div>
          <div className="grid max-w-2xl gap-3 text-sm text-white/85 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-white" />
              Fast dispatch
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-white" />
              Secure checkout
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-white" />
              Easy returns
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
