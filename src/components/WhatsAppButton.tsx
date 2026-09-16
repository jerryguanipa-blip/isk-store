import { buildLandingMessage, whatsappUrl } from "@/lib/checkout";
import { cn } from "@/lib/format";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

type WhatsAppButtonProps = {
  /** Si se indica, el mensaje menciona el color ("Triple White" / "Triple Black"). */
  colorName?: string;
  /** Mensaje ya armado; tiene prioridad sobre colorName. */
  message?: string;
  label?: string;
  /** "dark" = botón primario negro; "light" = botón secundario blanco con borde negro. */
  tone?: "light" | "dark";
  className?: string;
};

export function WhatsAppButton({
  colorName,
  message,
  label = "COMPRAR VÍA WHATSAPP",
  tone = "light",
  className,
}: WhatsAppButtonProps) {
  return (
    <a
      href={whatsappUrl(message ?? buildLandingMessage(colorName))}
      target="_blank"
      rel="noopener noreferrer"
      data-cta
      className={cn(
        "btn",
        tone === "light" ? "btn-secondary" : "btn-primary",
        className,
      )}
    >
      <WhatsAppIcon className="h-4 w-4 shrink-0" />
      {label}
    </a>
  );
}
