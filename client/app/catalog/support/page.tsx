"use client";

import Sidebar from "@/components/SideBarUser";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function SupportPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 relative">
        <h1 className="text-2xl font-bold mb-4">Soporte</h1>
        <p className="text-gray-600 mb-6">
          Estamos aquí para ayudarte. Si tienes dudas sobre tus reservas o el
          uso de la plataforma, revisa la siguiente información o contáctanos.
        </p>

        {/* 🔹 Sección de contacto */}
        <div className="bg-white p-6 rounded-xl shadow mb-6 max-w-xl">
          <h2 className="text-xl font-semibold mb-2">Contacto</h2>
          <p className="text-gray-600">📧 soporte@DriveUp.com</p>
          <p className="text-gray-600">📞 +57 322 724 9502</p>
          <p className="text-gray-600">⏰ Lunes a Viernes 8:00 - 18:00</p>
        </div>

        {/* 🔹 Preguntas frecuentes rápidas */}
        <div className="bg-white p-6 rounded-xl shadow max-w-xl">
          <h2 className="text-xl font-semibold mb-2">Preguntas Frecuentes</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>¿Cómo puedo cambiar la fecha de mi reserva?</li>
            <li>¿Qué hago si olvidé mi contraseña?</li>
            <li>¿Dónde puedo ver mis autos favoritos?</li>
          </ul>
        </div>

        {/* 🔹 Botón flotante de WhatsApp */}
        <WhatsAppButton message="Hola, necesito ayuda con mi reserva." />
      </main>
    </div>
  );
}
