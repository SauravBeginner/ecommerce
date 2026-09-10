import { CheckCircle2, Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const shopLinks = [
  { label: "All Products", to: "/shop" },
  { label: "Women", to: "/shop?for=women" },
  { label: "Men", to: "/shop?for=men" },
  { label: "Kids", to: "/shop?for=kids" },
  { label: "Wearables", to: "/shop?category=Wearables" },
  { label: "Apparel", to: "/shop?category=Apparel" },
  { label: "Desk Setup", to: "/shop?category=Desk%20Setup" },
  { label: "Audio", to: "/shop?category=Audio" },
  { label: "Wishlist", to: "/wishlist" },
];

const helpLinks = [
  { label: "About Us", to: "/about" },
  { label: "FAQs", to: "/contact" },
  { label: "Shipping Policy", to: "/help/shipping" },
  { label: "Return & Exchange", to: "/help/returns" },
  { label: "Track Your Order", to: "/track" },
  { label: "Size Guide", to: "/help/size-guide" },
  { label: "Privacy Policy", to: "/help/privacy" },
];


const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "https://instagram.com/ecomstore" },
  { icon: Twitter, label: "Twitter / X", href: "https://x.com/ecomstore" },
  { icon: Facebook, label: "Facebook", href: "https://facebook.com/ecomstore" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/@ecomstore" },
];

type FooterProps = {
  message: string;
};

export function Footer({ message }: FooterProps) {
  return (
    <footer className="border-t border-border/60 bg-card">
      {/* Main columns */}
      <div className="container py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-5">
            <Link to="/" className="inline-flex items-baseline font-display text-2xl tracking-tight text-foreground">
              ecom<span className="text-brand">.</span>
            </Link>
            <p className="text-sm leading-6 text-muted-foreground">
              Curated apparel, audio, carry goods, and desk pieces for sharper daily routines. Quality you can feel, delivered fast.
            </p>
            <div className="flex gap-2">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-border/80 text-muted-foreground transition hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <p className="font-bold">Shop</p>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-4">
            <p className="font-bold">Help & Support</p>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <p className="font-bold">Contact Us</p>
            <div className="space-y-2.5 text-sm text-muted-foreground">
              <a href="mailto:support@ecom.tech10x.in" className="flex items-center gap-2 transition-colors hover:text-primary">
                <Mail className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span>support@ecom.tech10x.in</span>
              </a>
              <a href="tel:+18001234567" className="flex items-center gap-2 transition-colors hover:text-primary">
                <Phone className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span>+1 (800) 123-4567</span>
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <span>Mon – Fri, 9am – 6pm EST</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider with payment info */}
      <div className="border-t border-border/60 bg-muted/20">
        <div className="container flex flex-wrap items-center justify-between gap-3 py-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-foreground">We accept:</span>
            {["Visa", "Mastercard", "PayPal", "Apple Pay", "Google Pay"].map((method) => (
              <span
                key={method}
                className="rounded border border-border/80 bg-card px-2 py-0.5 font-medium text-foreground"
              >
                {method}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span>All transactions are 256-bit SSL encrypted</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/60">
        <div className="container flex flex-col gap-2 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {message ? (
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                {message}
              </span>
            ) : (
              <span>© 2026 Ecom. All rights reserved.</span>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to="/help/terms" className="transition-colors hover:text-foreground">Terms of Service</Link>
            <Link to="/help/cookies" className="transition-colors hover:text-foreground">Cookie Policy</Link>
            <Link to="/help/accessibility" className="transition-colors hover:text-foreground">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
