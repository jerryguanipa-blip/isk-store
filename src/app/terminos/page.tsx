import type { Metadata } from "next";
import { LegalHeading, LegalList, LegalPage } from "@/components/LegalPage";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Condiciones de uso y de venta de la tienda ISK.",
  alternates: { canonical: "/terminos" },
};

export default function TerminosPage() {
  return (
    <LegalPage
      eyebrow="LEGAL"
      title="TÉRMINOS Y CONDICIONES"
      updated="16 de septiembre de 2026"
    >
      <p>
        Estos términos regulan el uso de {siteConfig.domain} y la compra de productos a
        través de este sitio. Al hacer un pedido aceptas lo que dice esta página.
      </p>

      <LegalHeading>1. QUIÉNES SOMOS</LegalHeading>
      <p>
        {siteConfig.fullName} es una tienda peruana de venta de zapatillas por internet.
        Los pedidos se cierran por WhatsApp y los productos se envían a todo el Perú.
      </p>

      <LegalHeading>2. PRODUCTOS Y PRECIOS</LegalHeading>
      <LegalList
        items={[
          `Todos los precios están en soles peruanos (PEN) e incluyen IGV. El precio vigente es ${formatPrice(siteConfig.price)} por par.`,
          "El costo de envío no está incluido en el precio y se informa antes del pago.",
          "Las fotos son referenciales: pueden existir mínimas diferencias de tono según la pantalla.",
          "Podemos cambiar los precios en cualquier momento, pero nunca después de haberte confirmado un pedido.",
        ]}
      />

      <LegalHeading>3. AUTENTICIDAD</LegalHeading>
      <p>
        Vendemos productos originales. Si compras un par y compruebas que no lo es, te
        devolvemos el 100% de tu dinero y asumimos los costos de envío.
      </p>

      <LegalHeading>4. CÓMO SE FORMALIZA LA COMPRA</LegalHeading>
      <LegalList
        items={[
          "Eliges tu producto y talla en la web.",
          "El pedido se envía por WhatsApp; ahí confirmamos stock, envío y forma de pago.",
          "La compra queda cerrada cuando confirmamos por escrito la disponibilidad y tú aceptas el total.",
          "Si el producto se agotó antes de confirmar, te avisamos y no se te cobra nada.",
        ]}
      />

      <LegalHeading>5. FORMAS DE PAGO</LegalHeading>
      <LegalList
        items={[
          "Yape, Plin y transferencia bancaria.",
          "Efectivo contra entrega, solo en Lima Metropolitana.",
          "Los pagos con tarjeta aún no están habilitados en esta versión de la web.",
        ]}
      />

      <LegalHeading>6. ENTREGA</LegalHeading>
      <p>
        Los plazos de entrega son estimados y dependen del courier. Los detalles están en
        la página de Envíos, que forma parte de estos términos.
      </p>

      <LegalHeading>7. CAMBIOS, DEVOLUCIONES Y RETRACTO</LegalHeading>
      <p>
        Se rigen por lo indicado en la página de Cambios y Devoluciones, que también
        forma parte de estos términos.
      </p>

      <LegalHeading>8. USO DEL SITIO</LegalHeading>
      <LegalList
        items={[
          "No puedes usar la web para fines ilegales ni intentar dañarla.",
          "El contenido (textos, diseño y logo ISK) es de la tienda; no puede copiarse sin permiso.",
          "Las marcas de terceros mencionadas pertenecen a sus respectivos titulares.",
        ]}
      />

      <LegalHeading>9. RESPONSABILIDAD</LegalHeading>
      <p>
        Respondemos por el producto vendido y por lo que ofrecemos en esta web. No
        respondemos por fallas de la red, del courier o de servicios de terceros que
        estén fuera de nuestro control razonable.
      </p>

      <LegalHeading>10. LEY APLICABLE Y RECLAMOS</LegalHeading>
      <p>
        Se aplica la ley peruana, en especial el Código de Protección y Defensa del
        Consumidor (Ley N.º 29571). Puedes presentar un reclamo en nuestro Libro de
        Reclamaciones virtual y, si no quedas conforme, acudir a Indecopi.
      </p>

      <LegalHeading>11. CONTACTO</LegalHeading>
      <p>
        WhatsApp desde el botón de la web o correo {siteConfig.email}.
      </p>
    </LegalPage>
  );
}
