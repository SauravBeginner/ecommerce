import { NavLink } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const helpGroups = [
  {
    heading: "About",
    links: [{ label: "Our story", to: "/about" }],
  },
  {
    heading: "Help",
    links: [
      { label: "Shipping policy", to: "/help/shipping" },
      { label: "Returns & exchange", to: "/help/returns" },
      { label: "Track your order", to: "/track" },
      { label: "Size guide", to: "/help/size-guide" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy policy", to: "/help/privacy" },
      { label: "Terms of service", to: "/help/terms" },
      { label: "Cookie policy", to: "/help/cookies" },
      { label: "Accessibility", to: "/help/accessibility" },
    ],
  },
];

export function HelpLinks({ className }: { className?: string }) {
  return (
    <Card className={cn("h-fit lg:sticky lg:top-24", className)}>
      <CardContent className="space-y-5 p-6">
        {helpGroups.map((group) => (
          <div key={group.heading}>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">{group.heading}</p>
            <ul className="space-y-0.5">
              {group.links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      cn(
                        "block rounded-lg px-3 py-1.5 text-sm transition hover:bg-accent/60",
                        isActive ? "bg-accent/60 font-semibold text-foreground" : "text-muted-foreground hover:text-foreground",
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
