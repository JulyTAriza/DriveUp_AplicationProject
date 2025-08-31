"use client";

import { usePathname } from "next/navigation";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function WhatsAppWrapper() {
  const pathname = usePathname();

  // ✅ Define las rutas donde quieres mostrar el botón
  const showOn = ["/", "/catalog/support", "/catalog/reservation"];

  if (!showOn.includes(pathname)) return null;

  // ✅ Mensaje dinámico según la ruta
let message = "¡Hola! Estoy interesado en DriveUp y me gustaría recibir información.";
if (pathname === "/") {
  message = "¡Hola! Estuve viendo autos en DriveUp y quiero más detalles";
} else if (pathname === "/catalog/support") {
  message = "¡Hola! Tengo una consulta y necesito hablar con soporte de DriveUp";
} else if (pathname === "/catalog/reservation") {
  message = "¡Hola! Necesito ayuda con una de mis reservas en DriveUp";
}

  return <WhatsAppButton message={message} />;
}

