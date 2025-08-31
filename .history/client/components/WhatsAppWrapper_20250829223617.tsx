"use client";

import { usePathname } from "next/navigation";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function WhatsAppWrapper() {
  const pathname = usePathname();

  // ✅ Define las rutas donde quieres mostrar el botón
  const showOn = ["/", "/catalog/support"];

  if (!showOn.includes(pathname)) return null;

  // ✅ Mensaje dinámico según la ruta
  let message = "Hola, necesito más información.";
  if (pathname === "/") {
    message = "Hola, quisiera más información sobre los autos disponibles.";
  } else if (pathname === "/catalog/support") {
    message = "Hola, necesito ayuda con mi reserva.";
  }

  return <WhatsAppButton message={message} />;
}
