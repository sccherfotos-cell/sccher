export const WHATSAPP_NUMBER = "5535992174364";
export const WHATSAPP_DEFAULT_MESSAGE =
  "Olá! Vim através do site e gostaria de mais informações sobre um ensaio.";

export function getWhatsAppUrl(message: string = WHATSAPP_DEFAULT_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
