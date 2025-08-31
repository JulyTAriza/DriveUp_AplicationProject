"use client";

import Sidebar from "@/components/SideBarUser";
import { MessageCircle } from "lucide-react";

export default function SupportPage() {
  const phoneNumber = "573001112233"; // 📞 número de soporte
  const message = encodeURIComponent("Hola, necesito ayuda con mi reserva");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 relative">
        <h1 className="text-2xl font-bold mb-4">Soporte</h1>
        <p className="text-gray-600 mb-6">
          Si tienes dudas o inconvenientes, contáctanos por WhatsApp o revisa
          nuestra sección de ayuda.
        </p>

        {/* Botón flotante de WhatsApp */}
        <a
          href={`https://wa.me/${phoneNumber}?text=${message}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
        >
          <MessageCircle size={28} />
        </a>
      </main>
    </div>
  );
}
