const marcas = ["NutriCan", "GatoFeliz", "PetGear", "AquaVida", "PlumasyPatas", "VitalPet"];

export function Marcas() {
  return (
    <section className="border-y border-border py-12">
      <div className="container-content">
        <p className="mb-8 text-center text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Trabajamos con las marcas que tu mascota ya conoce
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {marcas.map((marca) => (
            <span
              key={marca}
              className="font-display text-lg font-bold text-neutral-300 hover:text-sage-600"
            >
              {marca}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
