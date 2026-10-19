import type { Metadata } from "next";
import { LegalHeading, LegalList, LegalPage } from "@/components/LegalPage";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Envíos",
  description:
    "Enviamos tus Air Force 1 por Shalom a todo el Perú o por InDriver dentro de Lima, coordinado en el momento.",
  alternates: { canonical: "/envios" },
};

export default function EnviosPage() {
  return (
    <LegalPage eyebrow="INFORMACIÓN" title="ENVÍOS" updated="18 de octubre de 2026">
      <p>
        El pedido y el pago se coordinan por <strong>WhatsApp</strong>: eliges tus tallas en la
        web, nos mandas el pedido y ahí te pasamos los datos para pagar. Por seguridad, la web no
        muestra ningún número de pago. Enviamos únicamente por <strong>Shalom</strong> (agencias en todo el Perú) o por{" "}
        <strong>InDriver</strong> (dentro de Lima, en el momento). El costo del envío se coordina
        contigo por WhatsApp al confirmar tu pedido; el precio del producto es{" "}
        {formatPrice(siteConfig.price)}.
      </p>

      <LegalHeading>SHALOM — TODO EL PERÚ</LegalHeading>
      <LegalList
        items={[
          "Despachamos a la agencia Shalom que tú elijas.",
          "Nos pasas la ciudad y la agencia de destino al momento de pagar.",
          "El flete de Shalom lo pagas tú al recoger, según la tarifa de la agencia.",
          "Te mandamos el código de seguimiento apenas despachamos.",
          "Para recoger necesitas tu DNI y el nombre con el que se envió el paquete.",
        ]}
      />

      <LegalHeading>INDRIVER — LIMA, EN EL MOMENTO</LegalHeading>
      <LegalList
        items={[
          "Solo dentro de Lima Metropolitana.",
          "Pedimos el motorizado por InDriver apenas confirmamos tu pago.",
          "El costo lo pone la app según tu distrito y lo coordinamos contigo antes de enviarlo.",
          "Te compartimos los datos del motorizado por WhatsApp para que lo sigas en vivo.",
        ]}
      />

      <LegalHeading>CÓMO SE HACE UN PEDIDO</LegalHeading>
      <LegalList
        items={[
          "Eliges color y tallas en la web y tocas «Enviar pedido por WhatsApp».",
          "Se abre el chat con tu pedido ya escrito y su código (ej. ISK-4KQ9).",
          "Te pasamos los datos para pagar y nos mandas la captura.",
          "Confirmamos el pago y coordinamos el envío por Shalom o InDriver.",
        ]}
      />

      <LegalHeading>CUÁNTO TE GUARDAMOS LA TALLA</LegalHeading>
      <p>
        Al mandarnos el pedido te reservamos las tallas unos minutos. Si no cerramos la compra por
        WhatsApp, vuelven a quedar disponibles para otros clientes. No pasa nada: puedes pedirlas
        de nuevo cuando quieras.
      </p>

      <LegalHeading>COSTOS</LegalHeading>
      <p>
        El precio del producto es {formatPrice(siteConfig.price)} e incluye IGV. El envío se cotiza
        aparte y se te informa antes de cobrarte. Nunca te vamos a cobrar un monto que no hayas
        aceptado antes por escrito.
      </p>

      <LegalHeading>¿DUDAS?</LegalHeading>
      <p>
        Escríbenos por WhatsApp desde el botón verde de la esquina o al correo {siteConfig.email}.
        Respondemos de lunes a sábado.
      </p>
    </LegalPage>
  );
}
