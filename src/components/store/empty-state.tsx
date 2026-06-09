import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
  actions?: ReactNode;
};

export function EmptyState({ title, description, actions }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center gap-5 p-10 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold">{title}</h2>
          <p className="max-w-lg text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        {actions ? <div className="flex flex-wrap justify-center gap-3">{actions}</div> : null}
      </CardContent>
    </Card>
  );
}
