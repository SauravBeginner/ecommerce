import { Navigate, useParams } from "react-router-dom";
import { PageHero } from "@/components/store/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { HelpLinks } from "@/components/store/help-links";

type Section = { heading: string; body: string[] };
type Info = { eyebrow: string; title: string; description: string; updated: string; sections: Section[] };

export const infoPages: Record<string, Info> = {
  shipping: {
    eyebrow: "Help",
    title: "Shipping policy",
    description: "Where we ship, how long it takes, and what it costs.",
    updated: "September 2026",
    sections: [
      { heading: "Delivery options", body: ["Standard delivery arrives in 3–5 business days and is free on orders over $120 (otherwise $18).", "Express delivery arrives in 1–2 business days for $29. Orders placed before 2pm ship the same day."] },
      { heading: "Where we ship", body: ["We deliver across India and to 40+ countries. International duties and taxes are calculated at checkout so there are no surprises on arrival."] },
      { heading: "Tracking", body: ["You'll get a tracking link by email as soon as your parcel leaves our studio. You can also follow it under My account → Orders."] },
      { heading: "Something wrong?", body: ["If a parcel is delayed by more than 3 days past its estimate, or arrives damaged, write to support@ecom.tech10x.in and we'll sort it out."] },
    ],
  },
  returns: {
    eyebrow: "Help",
    title: "Returns & exchanges",
    description: "Changed your mind? You have 30 days.",
    updated: "September 2026",
    sections: [
      { heading: "The basics", body: ["Return anything within 30 days of delivery for a full refund, as long as it's unworn, unwashed and in its original packaging with tags attached.", "Returns are free. Start one from the order page in your account and we'll email a prepaid label."] },
      { heading: "Exchanges", body: ["Need a different size or colour? Choose Exchange instead of Return and we'll ship the replacement as soon as the original is scanned by the courier."] },
      { heading: "Refunds", body: ["Refunds go back to the original payment method within 5–7 business days of the return reaching us. Cash-on-delivery orders are refunded to your bank or UPI ID."] },
      { heading: "Exceptions", body: ["Earbuds and earphones can't be returned once the seal is broken, for hygiene reasons. Sale items can be exchanged but not refunded."] },
    ],
  },
  "size-guide": {
    eyebrow: "Help",
    title: "Size guide",
    description: "Measure once, order with confidence.",
    updated: "September 2026",
    sections: [
      { heading: "Apparel", body: ["XS: chest 84–88 cm · S: 88–94 · M: 94–100 · L: 100–106 · XL: 106–112.", "Measure around the fullest part of your chest with the tape level. If you're between sizes, size up for a relaxed fit."] },
      { heading: "Footwear", body: ["Our sizes follow US men's sizing: 7 = EU 40 = 25 cm · 8 = EU 41 = 26 cm · 9 = EU 42 = 27 cm · 10 = EU 43 = 28 cm · 11 = EU 44 = 29 cm · 12 = EU 45 = 30 cm.", "Measure your foot from heel to longest toe while standing."] },
      { heading: "Watches", body: ["40 mm suits wrists up to 17 cm; 44 mm suits 17 cm and above. Straps are adjustable and most have quick-release pins."] },
      { heading: "Still unsure?", body: ["Message us with your measurements and we'll recommend a size. Exchanges are free either way."] },
    ],
  },
  privacy: {
    eyebrow: "Legal",
    title: "Privacy policy",
    description: "What we collect, why, and how you stay in control.",
    updated: "September 2026",
    sections: [
      { heading: "What we collect", body: ["Your name, email, delivery address and order history when you shop with us. Payment details are handled by our payment provider and never stored on our servers; we keep only the last four digits of a card for your reference."] },
      { heading: "How we use it", body: ["To fulfil and support your orders, and, only if you've opted in, to send you member offers. You can change that preference any time from your profile."] },
      { heading: "Sharing", body: ["We share what's needed with couriers and payment providers to deliver and charge your order. We never sell personal data."] },
      { heading: "Your rights", body: ["Ask us for a copy of your data or to delete your account at support@ecom.tech10x.in. We respond within 30 days."] },
    ],
  },
  terms: {
    eyebrow: "Legal",
    title: "Terms of service",
    description: "The short, fair version of the rules.",
    updated: "September 2026",
    sections: [
      { heading: "Orders", body: ["An order is confirmed when you receive the confirmation email. We may cancel and refund an order if an item is out of stock or a price was clearly wrong."] },
      { heading: "Pricing", body: ["Prices are shown in USD and include applicable taxes unless stated otherwise. Promotional codes can't be combined."] },
      { heading: "Accounts", body: ["Keep your login details safe. You're responsible for activity on your account."] },
      { heading: "Liability", body: ["We're responsible for delivering what you ordered in the condition described. We're not liable for indirect losses."] },
    ],
  },
  cookies: {
    eyebrow: "Legal",
    title: "Cookie policy",
    description: "Small files, clearly explained.",
    updated: "September 2026",
    sections: [
      { heading: "Essential", body: ["Your cart, wishlist, sign-in state and theme preference are stored in your browser so the site works. These can't be switched off."] },
      { heading: "Analytics", body: ["We don't currently use analytics or advertising cookies. If that changes, we'll ask first."] },
      { heading: "Managing cookies", body: ["You can clear stored data any time from your browser settings. Doing so signs you out and empties your cart."] },
    ],
  },
  accessibility: {
    eyebrow: "Legal",
    title: "Accessibility",
    description: "Everyone should be able to shop here.",
    updated: "September 2026",
    sections: [
      { heading: "Our commitment", body: ["We aim to meet WCAG 2.1 AA. Every control is keyboard reachable, images carry descriptive text, and colour contrast is checked in both light and dark themes."] },
      { heading: "Known gaps", body: ["Product photos come from suppliers and occasionally lack detail in their descriptions. We're working through them."] },
      { heading: "Tell us", body: ["If anything is hard to use with assistive technology, email support@ecom.tech10x.in. We treat accessibility reports as bugs and fix them."] },
    ],
  },
};

export function InfoPage() {
  const { slug } = useParams();
  const page = slug ? infoPages[slug] : undefined;
  if (!page) return <Navigate to="/contact" replace />;

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} description={page.description} />
      <section className="pb-16 pt-8 sm:pb-20">
        <div className="container grid gap-8 lg:grid-cols-[1fr_300px]">
          <Card>
            <CardContent className="space-y-8 p-6 sm:p-8">
              {page.sections.map((section) => (
                <div key={section.heading}>
                  <h2 className="font-display text-2xl">{section.heading}</h2>
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="mt-2 text-sm leading-7 text-muted-foreground">{paragraph}</p>
                  ))}
                </div>
              ))}
              <p className="border-t border-border pt-4 text-xs text-muted-foreground">Last updated {page.updated}</p>
            </CardContent>
          </Card>
          <HelpLinks />
        </div>
      </section>
    </>
  );
}
