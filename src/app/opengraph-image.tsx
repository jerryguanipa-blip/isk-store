import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Mismo logo vectorial del resto de la web, embebido para poder rasterizarlo. */
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
<g fill="none" stroke="#FFFFFF" transform="rotate(-20 500 500)">
<ellipse cx="500" cy="500" rx="392" ry="250" stroke-width="26"/>
<ellipse cx="500" cy="500" rx="366" ry="226" stroke-width="9"/>
</g>
<g fill="#FFFFFF">
<rect x="224" y="384" width="100" height="50"/>
<rect x="224" y="574" width="100" height="50"/>
<rect x="245" y="384" width="58" height="240"/>
<rect x="544" y="384" width="58" height="240"/>
</g>
<path d="M 486 449 C 486 412 382 412 382 472 C 382 512 486 496 486 536 C 486 596 382 596 382 559" fill="none" stroke="#FFFFFF" stroke-width="56"/>
<path d="M 602 504 L 776 384" fill="none" stroke="#FFFFFF" stroke-width="58"/>
<path d="M 602 504 L 776 624" fill="none" stroke="#FFFFFF" stroke-width="58"/>
</svg>`;

const logoSrc = `data:image/svg+xml;base64,${Buffer.from(LOGO_SVG).toString("base64")}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000000",
          padding: "70px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={104} height={104} alt="" />
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 14,
              color: "#FFFFFF",
            }}
          >
            {siteConfig.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 118,
              lineHeight: 1,
              color: "#FFFFFF",
              letterSpacing: -2,
            }}
          >
            AIR FORCE 1
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 30,
              color: "#9A9A9A",
            }}
          >
            Triple White y Triple Black · EUR 36—44 · {formatPrice(siteConfig.price)}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "1px solid #2A2A2A",
            paddingTop: 28,
          }}
        >
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 8, color: "#FFFFFF" }}>
            {siteConfig.tagline}
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#9A9A9A" }}>
            {siteConfig.domain}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
