const brands = ["AURELIA", "KOVA", "NORD & CO", "MAISON LUNE", "ATELIER 9", "VESSEL"];

export function BrandStrip() {
  return (
    <section className="py-10 sm:py-14">
      <div className="container">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-sm">
          Stocking 40+ independent labels
        </p>
        <div className="mt-6 grid grid-cols-3 items-center gap-x-2 gap-y-5 border-y border-border py-5 sm:grid-cols-6 sm:py-6">
          {brands.map((brand) => (
            <span
              key={brand}
              className="whitespace-nowrap text-center font-display text-[11px] tracking-[0.12em] text-foreground/45 transition hover:text-foreground sm:text-sm sm:tracking-[0.15em] lg:text-base xl:text-lg"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
