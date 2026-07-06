export const WHATSAPP_NUMBER = "5535992174364";
export const WHATSAPP_DEFAULT_MESSAGE =
  "Olá! Conheci seu trabalho através do seu site e gostaria de mais informações sobre como funciona um ensaio com você.";

export function getWhatsAppUrl(message: string = WHATSAPP_DEFAULT_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
