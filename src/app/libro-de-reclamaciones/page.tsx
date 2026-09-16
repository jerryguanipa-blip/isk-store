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
    <div className="mx-auto max-w-[1800px] px-4 pt-10 pb-20 sm:px-6 lg:px-10 lg:pt-14">
      <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
        <header className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow text-muted">LEGAL · INDECOPI</p>
          <h1 className="display mt-3 text-3xl sm:text-4xl">
            LIBRO DE
            <br />
            RECLAMACIONES
          </h1>

          <div className="mt-8 border border-line p-5">
            <p className="text-xs leading-relaxed text-muted">
              Conforme al Código de Protección y Defensa del Consumidor (Ley N.º 29571),
              {" "}{siteConfig.fullName} pone a tu disposición este Libro de Reclamaciones
              virtual.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Responderemos tu reclamo en un plazo máximo de{" "}
              <strong className="text-ink">15 días hábiles</strong>.
            </p>
          </div>

          <p className="mt-6 text-xs leading-relaxed text-muted">
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
