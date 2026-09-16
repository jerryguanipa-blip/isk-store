"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { siteConfig } from "@/config/site";
import { IskLetterI, IskLetterK, IskLetterS } from "@/components/brand/IskMark";
import { ORBIT, VIEWBOX } from "@/components/brand/geometry";

const SESSION_KEY = "isk-intro-seen";
const MUTE_KEY = "isk-intro-muted";
const EASE = [0.22, 1, 0.36, 1] as const;

/** useLayoutEffect en el navegador, useEffect en el servidor (evita el warning de SSR). */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function Intro() {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  // Se renderiza desde el servidor para que la home no parpadee antes de la intro.
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const enterRef = useRef<HTMLButtonElement | null>(null);

  const isHome = pathname === "/";

  useIsomorphicLayoutEffect(() => {
    if (!isHome) {
      setVisible(false);
      return;
    }
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === "1") setVisible(false);
      if (window.localStorage.getItem(MUTE_KEY) === "1") setMuted(true);
    } catch {
      // Modo incógnito con almacenamiento bloqueado: la intro simplemente se muestra.
    }
  }, [isHome]);

  // Bloquea el scroll del fondo mientras la intro está en pantalla.
  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  // Enfoca el botón ENTRAR para poder usar la intro con teclado.
  useEffect(() => {
    if (!visible || leaving) return;
    const timer = window.setTimeout(
      () => enterRef.current?.focus({ preventScroll: true }),
      reduce ? 200 : 2700,
    );
    return () => window.clearTimeout(timer);
  }, [visible, leaving, reduce]);

  const finish = useCallback(
    (withSound: boolean) => {
      if (leaving) return;
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* sin almacenamiento: no pasa nada */
      }

      if (withSound && !muted && audioRef.current) {
        audioRef.current.volume = 0.85;
        // Los navegadores solo permiten sonido tras un clic: por eso suena aquí.
        void audioRef.current.play().catch(() => undefined);
      }

      setLeaving(true);
      window.setTimeout(() => setVisible(false), reduce ? 260 : 1250);
    },
    [leaving, muted, reduce],
  );

  const toggleMute = useCallback(() => {
    setMuted((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(MUTE_KEY, next ? "1" : "0");
      } catch {
        /* sin almacenamiento */
      }
      if (next && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, finish]);

  if (!isHome) return null;

  return (
    <>
      {/* Si el visitante no tiene JavaScript, la intro nunca debe tapar la tienda. */}
      <noscript>
        <style>{"#isk-intro{display:none !important}"}</style>
      </noscript>

      <AnimatePresence>
        {visible && (
          <motion.div
            id="isk-intro"
            role="dialog"
            aria-modal="true"
            aria-label={siteConfig.name + " — " + siteConfig.tagline}
            className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-black"
            initial={false}
            animate={leaving ? { y: "-100%" } : { y: 0 }}
            transition={{
              duration: reduce ? 0.25 : 0.9,
              delay: leaving && !reduce ? 0.35 : 0,
              ease: EASE,
            }}
          >
            <audio
              ref={audioRef}
              src="/brand/isk-intro.mp3"
              preload="auto"
              aria-hidden="true"
            />

            {/* Controles siempre visibles */}
            <div className="absolute inset-x-0 top-0 flex items-center justify-between px-5 py-5 sm:px-8">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Activar sonido de la intro" : "Silenciar la intro"}
                aria-pressed={muted}
                className="flex h-11 w-11 items-center justify-center border border-white/20 text-white/70 transition-colors hover:border-white hover:text-white"
              >
                {muted ? (
                  <VolumeX className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                ) : (
                  <Volume2 className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                )}
              </button>

              <button
                type="button"
                onClick={() => finish(false)}
                className="ui-label text-[11px] text-white/50 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                SALTAR INTRO
              </button>
            </div>

            {/* Logo + lema + botón */}
            <motion.div
              className="flex flex-col items-center px-6"
              animate={
                leaving
                  ? { scale: reduce ? 1 : 1.55, opacity: 0 }
                  : { scale: 1, opacity: 1 }
              }
              transition={{ duration: reduce ? 0.2 : 0.55, ease: EASE }}
            >
              <svg
                viewBox={VIEWBOX}
                className="h-40 w-40 text-white sm:h-56 sm:w-56"
                role="img"
                aria-label={siteConfig.name}
              >
                {/* La órbita se dibuja sola */}
                <g
                  transform={`rotate(${ORBIT.rotation} 500 500)`}
                  fill="none"
                  stroke="currentColor"
                >
                  <motion.ellipse
                    cx={ORBIT.outer.cx}
                    cy={ORBIT.outer.cy}
                    rx={ORBIT.outer.rx}
                    ry={ORBIT.outer.ry}
                    strokeWidth={ORBIT.outer.strokeWidth}
                    pathLength={1}
                    strokeDasharray="1 1"
                    initial={{ strokeDashoffset: reduce ? 0 : 1 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: reduce ? 0 : 1.5, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx={ORBIT.inner.cx}
                    cy={ORBIT.inner.cy}
                    rx={ORBIT.inner.rx}
                    ry={ORBIT.inner.ry}
                    strokeWidth={ORBIT.inner.strokeWidth}
                    pathLength={1}
                    strokeDasharray="1 1"
                    initial={{ strokeDashoffset: reduce ? 0 : 1 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{
                      duration: reduce ? 0 : 1.5,
                      delay: reduce ? 0 : 0.12,
                      ease: "easeInOut",
                    }}
                  />
                </g>

                {/* Las letras I, S, K aparecen una por una */}
                {[IskLetterI, IskLetterS, IskLetterK].map((Letter, index) => (
                  <motion.g
                    key={index}
                    initial={
                      reduce
                        ? { opacity: 1 }
                        : { opacity: 0, scale: 0.86, filter: "blur(14px)" }
                    }
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    style={{ transformOrigin: "500px 500px" }}
                    transition={{
                      duration: reduce ? 0 : 0.6,
                      delay: reduce ? 0 : 0.55 + index * 0.3,
                      ease: EASE,
                    }}
                  >
                    <Letter />
                  </motion.g>
                ))}
              </svg>

              <motion.p
                className="display mt-10 text-center text-[11px] text-white sm:text-sm"
                initial={
                  reduce
                    ? { opacity: 1, letterSpacing: "0.3em" }
                    : { opacity: 0, letterSpacing: "0.04em" }
                }
                animate={{ opacity: 1, letterSpacing: "0.3em" }}
                transition={{
                  duration: reduce ? 0 : 1,
                  delay: reduce ? 0 : 1.75,
                  ease: EASE,
                }}
              >
                {siteConfig.tagline}
              </motion.p>

              <motion.button
                ref={enterRef}
                type="button"
                onClick={() => finish(true)}
                initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduce ? 0 : 0.6,
                  delay: reduce ? 0 : 2.6,
                  ease: EASE,
                }}
                className="group relative mt-14 overflow-hidden border border-white px-14 py-4"
              >
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 bg-white"
                  initial={{ opacity: 0.06 }}
                  animate={reduce ? { opacity: 0.06 } : { opacity: [0.06, 0.2, 0.06] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 3.2,
                  }}
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-bottom scale-y-0 bg-white transition-transform duration-500 group-hover:scale-y-100"
                />
                <span className="ui-label relative text-xs text-white group-hover:opacity-0">
                  ENTRAR
                </span>
                <span
                  aria-hidden="true"
                  className="ui-label pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-black opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                >
                  ENTRAR
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
