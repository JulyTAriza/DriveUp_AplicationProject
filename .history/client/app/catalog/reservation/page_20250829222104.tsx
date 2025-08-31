"use client";

import Sidebar from "@/components/SideBarUser";

export default function ReservationsPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Mis Reservas</h1>
        <p className="text-gray-600">
          Aquí podrás ver el historial de todas tus reservas realizadas.
        </p>

        {/* 🔽 Lista de reservas del usuario */}
        <div className="mt-6 grid gap-4">
          {/* Placeholder */}
          <div className="p-4 bg-white rounded-xl shadow">
            <h2 className="font-semibold">Reserva #1</h2>
            <p className="text-sm text-gray-500">
              Auto: Toyota Corolla – Fechas: 12/10/2024 al 15/10/2024
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
