"use client";

import { useEffect, useRef, useState } from "react";
import { VolumeX } from "lucide-react";

const SESSION_KEY = "isk-intro-audio";
const SRC = "/brand/isk-intro.mp3";
const UNLOCK_EVENTS = ["pointerdown", "keydown", "touchend"] as const;

/**
 * Intro sonora de la marca ("ISK — Imagina, Sueña, Krea").
 *
 * - Suena completa UNA sola vez por visita (sessionStorage), sin loop.
 * - Primero intenta autoplay; si el navegador lo bloquea (lo normal en
 *   móviles) espera la primera interacción real del usuario y ahí suena.
 * - Vive en el layout raíz: navegar entre páginas no la reinicia.
 * - Mientras suena aparece un botón pequeño para silenciarla.
 */
export function BrandAudio() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === "1") return;
    } catch {
      /* sin almacenamiento: se intenta igual */
    }

    const audio = new Audio(SRC);
    audio.preload = "auto";
    audio.loop = false;
    audioRef.current = audio;

    let started = false;
    let pending = false;

    const onInteract = () => tryPlay();
    const removeUnlock = () =>
      UNLOCK_EVENTS.forEach((type) => window.removeEventListener(type, onInteract, true));

    function tryPlay() {
      if (started || pending) return;
      pending = true;
      audio
        .play()
        .then(() => {
          started = true;
          removeUnlock();
          try {
            window.sessionStorage.setItem(SESSION_KEY, "1");
          } catch {
            /* sin almacenamiento */
          }
        })
        .catch(() => {
          /* autoplay bloqueado: esperamos la primera interacción, sin mostrar nada */
        })
        .finally(() => {
          pending = false;
        });
    }

    const onPlaying = () => setPlaying(true);
    const onStop = () => setPlaying(false);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("ended", onStop);
    audio.addEventListener("pause", onStop);

    UNLOCK_EVENTS.forEach((type) =>
      window.addEventListener(type, onInteract, { capture: true, passive: true }),
    );

    // No bloquea el primer render: se intenta cuando la página ya pintó.
    const timer = window.setTimeout(tryPlay, 400);

    return () => {
      window.clearTimeout(timer);
      removeUnlock();
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("ended", onStop);
      audio.removeEventListener("pause", onStop);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  if (!playing) return null;

  return (
    <button
      type="button"
      onClick={() => audioRef.current?.pause()}
      className="ui-label fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-4 z-[86] flex h-11 items-center gap-2 border border-white/25 bg-black/80 px-4 text-[10px] text-white backdrop-blur-sm transition-colors hover:border-white sm:left-6"
      aria-label="Silenciar la intro de ISK"
    >
      <VolumeX className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
      SILENCIAR
    </button>
  );
}
