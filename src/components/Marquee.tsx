import { cn } from "@/lib/format";

type MarqueeProps = {
  text: string;
  /** Veces que se repite la frase dentro de cada mitad de la cinta */
  repeat?: number;
  className?: string;
};

/**
 * Cinta infinita y discreta (12px) para la barra de anuncio.
 * Cada repetición empieza con la frase completa y las dos mitades son
 * idénticas, así el salto del loop es invisible.
 */
export function Marquee({ text, repeat = 8, className }: MarqueeProps) {
  const half = (copy: number) => (
    <div className="flex shrink-0 items-center" aria-hidden={copy > 0}>
      {Array.from({ length: repeat }, (_, i) => (
        <span key={i} className="flex items-center whitespace-nowrap">
          <span className="px-6">{text}</span>
          <span aria-hidden="true" className="text-muted">
            ·
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={cn("overflow-hidden", className)}>
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
