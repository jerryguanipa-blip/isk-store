import type { SVGProps } from "react";
import { ORBIT, LETTER_I, LETTER_K, LETTER_S, VIEWBOX } from "./geometry";

type MarkProps = SVGProps<SVGSVGElement> & {
  /** Color del logo. El fondo lo pone el contenedor. */
  tone?: "light" | "dark";
  title?: string;
};

/** Órbita elíptica (dos elipses concéntricas, como el logo original). */
export function IskOrbitPaths() {
  return (
    <g transform={`rotate(${ORBIT.rotation} 500 500)`} fill="none" stroke="currentColor">
      <ellipse {...ORBIT.outer} strokeWidth={ORBIT.outer.strokeWidth} />
      <ellipse {...ORBIT.inner} strokeWidth={ORBIT.inner.strokeWidth} />
    </g>
  );
}

export function IskLetterI() {
  return (
    <g fill="currentColor">
      {LETTER_I.bars.map((bar) => (
        <rect key={`${bar.x}-${bar.y}`} {...bar} />
      ))}
      <rect {...LETTER_I.stem} />
    </g>
  );
}

export function IskLetterS() {
  return (
    <path
      d={LETTER_S.d}
      fill="none"
      stroke="currentColor"
      strokeWidth={LETTER_S.strokeWidth}
      strokeLinecap="butt"
    />
  );
}

export function IskLetterK() {
  return (
    <g fill="currentColor">
      <rect {...LETTER_K.stem} />
      {LETTER_K.arms.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={LETTER_K.strokeWidth}
          strokeLinecap="butt"
        />
      ))}
    </g>
  );
}

/** Logo ISK completo, estático. Hereda el color con `currentColor`. */
export function IskMark({ tone = "light", title = "ISK", ...props }: MarkProps) {
  return (
    <svg
      viewBox={VIEWBOX}
      role="img"
      aria-label={title}
      style={{ color: tone === "light" ? "#FFFFFF" : "#000000", ...props.style }}
      {...props}
    >
      <IskOrbitPaths />
      <IskLetterI />
      <IskLetterS />
      <IskLetterK />
    </svg>
  );
}

/** Logo + lema, para el footer y la 404. */
export function IskLockup({ className }: { className?: string }) {
  return (
    <div className={className}>
      <IskMark className="h-16 w-16" />
    </div>
  );
}
