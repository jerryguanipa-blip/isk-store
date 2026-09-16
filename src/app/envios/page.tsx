import type { Metadata } from "next";
import { LegalHeading, LegalList, LegalPage } from "@/components/LegalPage";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Envíos",
  description:
    "Cómo, cuándo y a qué costo enviamos tus Air Force 1 a cualquier parte del Perú.",
  alternates: { canonical: "/envios" },
};

export default function EnviosPage() {
  return (
    <LegalPage eyebrow="INFORMACIÓN" title="ENVÍOS" updated="16 de septiembre de 2026">
      <p>
        Enviamos a todo el Perú. El costo exacto del envío se te confirma por WhatsApp
        antes de que pagues, según tu distrito o provincia.
      </p>

      <LegalHeading>LIMA METROPOLITANA</LegalHeading>
      <LegalList
        items={[
          "Entrega en 24 a 48 horas hábiles.",
          "Pago contra entrega disponible: pagas cuando recibes el paquete.",
          "También puedes pagar por adelantado con Yape, Plin o transferencia.",
          "Coordinamos el horario de entrega contigo por WhatsApp.",
        ]}
      />

      <LegalHeading>PROVINCIAS</LegalHeading>
      <LegalList
        items={[
          "Enviamos por Olva Courier y Shalom.",
          "Entrega en 2 a 5 días hábiles según el destino.",
          "El envío a provincia se paga por adelantado (Yape, Plin o transferencia).",
          "Te damos el número de seguimiento apenas despachamos el paquete.",
        ]}
      />

      <LegalHeading>CÓMO SE HACE UN PEDIDO</LegalHeading>
      <LegalList
        items={[
          "Eliges color y talla en la web y agregas al carrito.",
          "Tocas «Finalizar pedido por WhatsApp»: se abre el chat con tu pedido escrito.",
          "Nos envías tu nombre completo, dirección y distrito.",
          "Te confirmamos disponibilidad, costo de envío y tiempo de entrega.",
        ]}
      />

      <LegalHeading>COSTOS</LegalHeading>
      <p>
        El precio del producto es {formatPrice(siteConfig.price)} e incluye IGV. El envío
        se cotiza aparte y se te informa antes de cobrarte. Nunca te vamos a cobrar un
        monto que no hayas aceptado antes por escrito.
      </p>

      <LegalHeading>SI NO ESTÁS CUANDO LLEGA EL PAQUETE</LegalHeading>
      <p>
        En Lima reprogramamos la entrega una vez sin costo. A partir del segundo
        reintento se cobra nuevamente el costo del envío. En provincia, el paquete queda
        en la agencia del courier a tu nombre por el plazo que indique la empresa.
      </p>

      <LegalHeading>¿DUDAS?</LegalHeading>
      <p>
        Escríbenos por WhatsApp desde el botón verde de la esquina o al correo{" "}
        {siteConfig.email}. Respondemos de lunes a sábado.
      </p>
    </LegalPage>
  );
}
