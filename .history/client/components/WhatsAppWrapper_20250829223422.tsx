"use client";

import { usePathname } from "next/navigation";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function WhatsAppWrapper() {
  const pathname = usePathname();

  // Definimos en qué páginas se mostrará el botón
  const showOn = ["/catalog", "/catalog/support"];

  const shouldShow = showOn.some((route) =>
    pathname === route || pathname.startsWith("/catalog/")
  );

  if (!shouldShow) return null;

  // Mensajes dinámicos
  let message = "Hola, necesito más información.";
  if (pathname === "/catalog") {
    message = "Hola, quisiera más información sobre los autos disponibles.";
  } else if (pathname.startsWith("/catalog/") && pathname !== "/catalog/support") {
    message = "Hola, me interesa este auto. ¿Está disponible en estas fechas?";
  } else if (pathname === "/catalog/support") {
    message = "Hola, necesito ayuda con mi reserva.";
  }

  return <WhatsAppButton message={message} />;
}
