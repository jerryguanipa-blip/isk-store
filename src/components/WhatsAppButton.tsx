import { buildLandingMessage, whatsappUrl } from "@/lib/checkout";
import { cn } from "@/lib/format";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

type WhatsAppButtonProps = {
  /** Si se indica, el mensaje menciona el color ("Triple White" / "Triple Black"). */
  colorName?: string;
  /** Mensaje ya armado; tiene prioridad sobre colorName. */
  message?: string;
  label?: string;
  /** "light" = botón blanco (para fondos negros); "dark" = botón negro (para fondos blancos). */
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
        "ui-label inline-flex min-h-13 items-center justify-center gap-3 px-8 text-xs transition-opacity hover:opacity-80",
        tone === "light" ? "bg-white text-black" : "bg-black text-white",
        className,
      )}
    >
      <WhatsAppIcon className="h-4 w-4 shrink-0" />
      {label}
    </a>
  );
}
