import type { Metadata } from "next";
import { LegalHeading, LegalList, LegalPage } from "@/components/LegalPage";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Cambios y devoluciones",
  description:
    "Cambio de talla en 7 días, condiciones y pasos para devolver un producto en ISK.",
  alternates: { canonical: "/cambios" },
};

export default function CambiosPage() {
  return (
    <LegalPage
      eyebrow="INFORMACIÓN"
      title="CAMBIOS Y DEVOLUCIONES"
      updated="16 de septiembre de 2026"
    >
      <p>
        Queremos que te queden bien. Si te equivocaste de talla, te la cambiamos. Si el
        producto llegó con una falla, te lo reponemos o te devolvemos tu dinero.
      </p>

      <LegalHeading>CAMBIO DE TALLA</LegalHeading>
      <LegalList
        items={[
          "Tienes 7 días calendario desde que recibes el paquete.",
          "El producto debe estar sin uso, sin suciedad y con su caja original.",
          "El primer cambio de talla no tiene costo de gestión; el envío de ida y vuelta lo asume el cliente.",
          "Si la talla que pides no está disponible, puedes elegir el otro color o pedir la devolución del dinero.",
        ]}
      />

      <LegalHeading>PRODUCTO CON FALLA O EQUIVOCADO</LegalHeading>
      <LegalList
        items={[
          "Tienes 7 días calendario para avisarnos.",
          "Envíanos fotos o un video por WhatsApp mostrando el problema.",
          "Si la falla es de fábrica o te enviamos el producto equivocado, todos los costos de envío los asumimos nosotros.",
          "Te damos a elegir: reposición del mismo producto o devolución total del dinero.",
        ]}
      />

      <LegalHeading>DERECHO DE RETRACTO (COMPRA A DISTANCIA)</LegalHeading>
      <p>
        Como la compra se hace a distancia, puedes desistir de ella. Avísanos dentro de
        los 7 días calendario siguientes a la recepción, con el producto sin uso y en su
        empaque original. Te devolvemos el importe del producto por el mismo medio de
        pago; el costo del envío de retorno corre por tu cuenta, salvo que el motivo sea
        una falla nuestra.
      </p>

      <LegalHeading>QUÉ NO SE PUEDE CAMBIAR</LegalHeading>
      <LegalList
        items={[
          "Productos usados en la calle, con la suela marcada o con olor.",
          "Productos sin la caja original o con la caja destruida.",
          "Productos modificados, pintados o intervenidos.",
          "Solicitudes hechas después de los 7 días calendario.",
        ]}
      />

      <LegalHeading>CÓMO PEDIR UN CAMBIO</LegalHeading>
      <LegalList
        items={[
          "Escríbenos por WhatsApp con tu nombre y la fecha de compra.",
          "Cuéntanos qué necesitas y adjunta fotos del producto y de la caja.",
          "Te confirmamos si procede y te indicamos a dónde enviarlo.",
          "Al recibirlo lo revisamos y hacemos el cambio o la devolución en un máximo de 5 días hábiles.",
        ]}
      />

      <LegalHeading>DEVOLUCIÓN DEL DINERO</LegalHeading>
      <p>
        La devolución se hace por el mismo medio por el que pagaste (Yape, Plin,
        transferencia o efectivo) dentro de los 5 días hábiles siguientes a que
        aprobemos la solicitud.
      </p>

      <LegalHeading>¿NO LLEGAMOS A UN ACUERDO?</LegalHeading>
      <p>
        Puedes dejar tu reclamo formal en nuestro Libro de Reclamaciones virtual, o
        escribirnos a {siteConfig.email}. Tenemos 15 días hábiles para responderte.
      </p>
    </LegalPage>
  );
}
