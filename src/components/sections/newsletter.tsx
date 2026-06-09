import { FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type NewsletterProps = {
  email: string;
  setEmail: (value: string) => void;
  onSubmit: () => void;
};

export function Newsletter({ email, setEmail, onSubmit }: NewsletterProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <section className="pb-16 pt-8 sm:pb-20">
      <div className="container">
        <Card className="overflow-hidden bg-slate-950 text-white">
          <CardContent className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
                Stay in the loop
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Launch offers, curated drops, and smarter conversion ideas.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
                Get first access to new drops, limited offers, and seasonal edits.
              </p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                className="border-white/15 bg-white/10 text-white placeholder:text-white/45"
              />
              <Button type="submit" size="lg" className="w-full bg-white text-slate-950 hover:bg-white/90">
                Join newsletter
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
