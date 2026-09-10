import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHero({ eyebrow, title, description, actions }: PageHeroProps) {
  return (
    <section className="py-6 sm:py-8">
      <div className="container">
        <div className="border-b border-border/80 pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand">{eyebrow}</p>
          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="font-display text-4xl sm:text-5xl">{title}</h1>
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
