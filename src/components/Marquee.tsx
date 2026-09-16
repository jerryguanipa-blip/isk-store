import { cn } from "@/lib/format";

type MarqueeProps = {
  text: string;
  /** Veces que se repite el texto dentro de cada mitad de la cinta */
  repeat?: number;
  className?: string;
  inverted?: boolean;
};

export function Marquee({ text, repeat = 6, className, inverted = false }: MarqueeProps) {
  const half = Array.from({ length: repeat }, (_, i) => (
    <span key={i} className="display px-6 text-[13vw] leading-none sm:text-[7vw] lg:text-[5vw]">
      {text}
    </span>
  ));

  return (
    <div
      className={cn(
        "overflow-hidden border-y py-6",
        inverted ? "border-black/10 bg-white text-black" : "border-white/10 bg-black text-white",
        className,
      )}
      aria-hidden="true"
    >
      <div className="isk-marquee-track">
        <div className="flex shrink-0">{half}</div>
        <div className="flex shrink-0">{half}</div>
      </div>
    </div>
  );
}
