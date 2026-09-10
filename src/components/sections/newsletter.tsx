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
    <section className="pb-16 pt-10 sm:pb-20 sm:pt-14">
      <div className="container">
        <Card className="overflow-hidden bg-foreground text-background">
          <CardContent className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-background/60">
                Stay in the loop
              </p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl">
                Early access to new drops, member offers, and seasonal edits.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-background/70">
                One email a week. Unsubscribe any time.
              </p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                className="border-background/15 bg-background/10 text-background placeholder:text-background/45"
              />
              <Button type="submit" size="lg" className="w-full bg-background text-foreground hover:bg-background/90">
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
