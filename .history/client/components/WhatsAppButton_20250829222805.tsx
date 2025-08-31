"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  message?: string; // mensaje dinámico
}

export default function WhatsAppButton({ message }: WhatsAppButtonProps) {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573227249502"; 
  const text = encodeURIComponent(message || "Hola, necesito más información");

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
    >
      <MessageCircle size={28} />
    </a>
  );
}
