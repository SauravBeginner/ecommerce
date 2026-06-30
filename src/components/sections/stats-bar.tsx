import { useEffect, useRef, useState } from "react";

const stats = [
  { end: 10, suffix: "K+", label: "Happy Customers", duration: 1200 },
  { end: 4.8, decimals: 1, suffix: "★", label: "Average Rating", duration: 1400 },
  { end: 500, suffix: "+", label: "Products", duration: 1600 },
  { end: 24, suffix: "hr", label: "Fast Dispatch", duration: 1000 },
];

function useCountUp(end: number, duration: number, decimals: number, active: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      setValue(parseFloat((ease * end).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(tick);
      else setValue(end);
    };

    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, end, duration, decimals]);

  return value;
}

function StatItem({
  end,
  suffix,
  label,
  duration,
  decimals = 0,
  delay,
  active,
}: {
  end: number;
  suffix: string;
  label: string;
  duration: number;
  decimals?: number;
  delay: number;
  active: boolean;
}) {
  const [started, setStarted] = useState(false);
  const value = useCountUp(end, duration, decimals, started);

  useEffect(() => {
    if (!active || started) return;
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [active, delay, started]);

  return (
    <div
      className="text-center transition-all duration-700"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(20px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <p className="text-2xl font-extrabold sm:text-3xl">
        {decimals ? value.toFixed(decimals) : Math.round(value)}
        {suffix}
      </p>
      <p className="mt-0.5 text-xs font-medium text-primary-foreground/70 sm:text-sm">
        {label}
      </p>
    </div>
  );
}

export function StatsBar() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-primary py-5 text-primary-foreground">
      <div className="container grid grid-cols-2 gap-6 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <StatItem key={stat.label} {...stat} delay={i * 120} active={active} />
        ))}
      </div>
    </section>
  );
}
