import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHero({ eyebrow, title, description, actions }: PageHeroProps) {
  return (
    <section className="bg-muted/25 py-12 sm:py-16">
      <div className="container">
        <div className="border-b border-border/80 pb-8">
          <Badge>{eyebrow}</Badge>
          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold sm:text-5xl">{title}</h1>
              <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
                {description}
              </p>
            </div>
            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
