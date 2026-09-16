import type { Metadata } from "next";
import { LegalHeading, LegalList, LegalPage } from "@/components/LegalPage";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Qué datos personales pedimos, para qué los usamos y cómo puedes pedir que los borremos.",
  alternates: { canonical: "/privacidad" },
};

export default function PrivacidadPage() {
  return (
    <LegalPage
      eyebrow="LEGAL"
      title="POLÍTICA DE PRIVACIDAD"
      updated="16 de septiembre de 2026"
    >
      <p>
        Esta política explica qué datos personales tratamos en {siteConfig.domain}, con
        qué finalidad y qué derechos tienes. Cumple con la Ley N.º 29733, Ley de
        Protección de Datos Personales del Perú, y su reglamento.
      </p>

      <LegalHeading>QUÉ DATOS PEDIMOS</LegalHeading>
      <LegalList
        items={[
          "Para enviarte un pedido: nombre completo, teléfono, dirección y distrito.",
          "Para un reclamo: nombre, documento de identidad, teléfono y correo.",
          "Datos técnicos anónimos de navegación (páginas vistas, tipo de dispositivo).",
        ]}
      />
      <p>
        No pedimos ni guardamos números de tarjeta, claves ni datos bancarios. Los pagos
        se hacen fuera de la web (Yape, Plin, transferencia o efectivo).
      </p>

      <LegalHeading>PARA QUÉ LOS USAMOS</LegalHeading>
      <LegalList
        items={[
          "Preparar, enviar y hacer seguimiento a tu pedido.",
          "Responder tus consultas por WhatsApp o correo.",
          "Atender cambios, devoluciones y reclamos.",
          "Cumplir obligaciones legales y tributarias.",
        ]}
      />

      <LegalHeading>CON QUIÉN LOS COMPARTIMOS</LegalHeading>
      <LegalList
        items={[
          "Con la empresa de mensajería que lleva tu paquete (Olva, Shalom u otra), solo lo necesario para entregarlo.",
          "Con WhatsApp / Meta, porque la conversación ocurre en su plataforma y se rige por sus propias políticas.",
          "Con Vercel, que aloja la web y procesa datos técnicos de la visita.",
          "Nunca vendemos ni alquilamos tus datos a terceros.",
        ]}
      />

      <LegalHeading>CUÁNTO TIEMPO LOS GUARDAMOS</LegalHeading>
      <p>
        Los datos de un pedido se conservan mientras dure la relación comercial y el
        plazo legal aplicable. Los reclamos se conservan por lo menos dos años, tal como
        exige la normativa del Libro de Reclamaciones.
      </p>

      <LegalHeading>COOKIES</LegalHeading>
      <p>
        Esta web no usa cookies de publicidad ni de seguimiento de terceros. Solo usamos
        el almacenamiento del navegador para recordar tu carrito y si ya viste la intro.
        Esa información se queda en tu dispositivo y puedes borrarla limpiando los datos
        del sitio.
      </p>

      <LegalHeading>TUS DERECHOS</LegalHeading>
      <p>
        Puedes pedirnos acceder, rectificar, cancelar u oponerte al tratamiento de tus
        datos (derechos ARCO). Escríbenos a {siteConfig.email} o por WhatsApp y te
        respondemos. Si consideras que no atendimos tu solicitud, puedes acudir a la
        Autoridad Nacional de Protección de Datos Personales.
      </p>

      <LegalHeading>MENORES DE EDAD</LegalHeading>
      <p>
        La tienda está dirigida a mayores de 18 años. Si eres menor, pide a tu padre,
        madre o apoderado que haga la compra.
      </p>

      <LegalHeading>CAMBIOS EN ESTA POLÍTICA</LegalHeading>
      <p>
        Si la actualizamos, publicaremos la nueva versión en esta misma página con su
        fecha.
      </p>
    </LegalPage>
  );
}
