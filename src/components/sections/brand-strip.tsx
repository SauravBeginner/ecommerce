const brands = ["AURELIA", "KOVA", "NORD & CO", "MAISON LUNE", "ATELIER 9", "VESSEL"];

export function BrandStrip() {
  return (
    <section className="py-10 sm:py-14">
      <div className="container">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Stocking 40+ independent labels
        </p>
        <div className="mt-6 grid grid-cols-3 items-center gap-y-6 border-y border-border py-6 sm:grid-cols-6">
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-center font-display text-xl tracking-[0.15em] text-foreground/45 transition hover:text-foreground sm:text-2xl"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
