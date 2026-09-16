import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ComplaintForm } from "./ComplaintForm";

export const metadata: Metadata = {
  title: "Libro de Reclamaciones",
  description:
    "Libro de Reclamaciones virtual de ISK, conforme al Código de Protección y Defensa del Consumidor del Perú.",
  alternates: { canonical: "/libro-de-reclamaciones" },
};

export default function LibroDeReclamacionesPage() {
  return (
    <div className="mx-auto max-w-[1800px] px-4 pt-28 pb-24 sm:px-6 lg:px-10 lg:pt-36">
      <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
        <header className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow text-white/55">LEGAL · INDECOPI</p>
          <h1 className="display mt-5 text-4xl leading-[0.95] sm:text-5xl">
            LIBRO DE
            <br />
            RECLAMACIONES
          </h1>

          <div className="mt-8 border border-white/15 p-5">
            <p className="text-xs leading-relaxed text-white/55">
              Conforme al Código de Protección y Defensa del Consumidor (Ley N.º 29571),
              {" "}{siteConfig.fullName} pone a tu disposición este Libro de Reclamaciones
              virtual.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-white/55">
              Responderemos tu reclamo en un plazo máximo de{" "}
              <strong className="text-white">15 días hábiles</strong>.
            </p>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-white/55">
            Los campos marcados con * son obligatorios. Al enviar, se abrirá WhatsApp con
            tu reclamo ya redactado y recibirás un código para hacerle seguimiento.
          </p>
        </header>

        <div className="max-w-2xl">
          <ComplaintForm />
        </div>
      </div>
    </div>
  );
}
