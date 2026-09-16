import { cn } from "@/lib/format";

type MarqueeProps = {
  text: string;
  /** Veces que se repite la frase dentro de cada mitad de la cinta */
  repeat?: number;
  className?: string;
  inverted?: boolean;
};

/**
 * Cinta infinita. Cada repetición empieza con la frase completa
 * ("IMAGINA · SUEÑA · KREA") y las dos mitades son idénticas, así el
 * salto del loop es invisible.
 */
export function Marquee({ text, repeat = 4, className, inverted = false }: MarqueeProps) {
  const half = (copy: number) => (
    <div className="flex shrink-0 items-center" aria-hidden={copy > 0}>
      {Array.from({ length: repeat }, (_, i) => (
        <span key={i} className="display isk-marquee-item flex items-center whitespace-nowrap">
          <span className="px-[0.35em]">{text}</span>
          <span aria-hidden="true" className="px-[0.35em] opacity-40">
            ·
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        "overflow-hidden border-y py-6 sm:py-8",
        inverted ? "border-black/10 bg-white text-black" : "border-white/10 bg-black text-white",
        className,
      )}
    >
      <p className="sr-only">{text}</p>
      <div className="isk-marquee-mask overflow-hidden" aria-hidden="true">
        <div className="isk-marquee-track">
          {half(0)}
          {half(1)}
        </div>
      </div>
    </div>
  );
}
