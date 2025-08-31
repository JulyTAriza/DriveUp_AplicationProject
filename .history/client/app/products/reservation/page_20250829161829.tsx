"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle } from "lucide-react";
import { reservationApi, Reservation } from "@/state/api"; // <-- igual que carApi, necesitas exponer en api.ts
import Image from "next/image";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // cargar reservas al inicio
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await reservationApi.getAll();
        setReservations(data);
      } catch (err) {
        console.error("Error cargando reservas:", err);
      }
    };
    fetchReservations();
  }, []);

  // confirmar reserva
  const handleConfirm = async (id: number) => {
    try {
      await reservationApi.updateStatus(id, "CONFIRMADA");
      setReservations((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: "CONFIRMADA" } : r
        )
      );
    } catch (err) {
      console.error("Error confirmando reserva:", err);
    }
  };

  // cancelar reserva
  const handleCancel = async (id: number) => {
    if (confirm("¿Seguro que quieres cancelar esta reserva?")) {
      try {
        await reservationApi.updateStatus(id, "CANCELADA");
        setReservations((prev) =>
          prev.map((r) =>
            r.id === id ? { ...r, status: "CANCELADA" } : r
          )
        );
      } catch (err) {
        console.error("Error cancelando reserva:", err);
      }
    }
  };

  // filtrar reservas
  const filteredReservations = reservations.filter(
    (r) =>
      r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH */}
      <div className="mb-6 flex items-center border-2 border-gray-200 rounded">
        <Search className="w-5 h-5 text-gray-500 m-2" />
        <input
          className="w-full py-2 px-4 rounded bg-white"
          placeholder="Buscar por usuario o producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Reservas</h1>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-4 text-left">Producto</th>
              <th className="py-3 px-4 text-left">Usuario</th>
              <th className="py-3 px-4 text-left">Fecha Inicio</th>
              <th className="py-3 px-4 text-left">Fecha Fin</th>
              <th className="py-3 px-4 text-left">Estado</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No encontramos reservas
                </td>
              </tr>
            ) : (
              filteredReservations.map((res) => (
                <tr key={res.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <Image
                      src={
                        res.productImage
                          ? res.productImage
                          : "/cars/default.jpg"
                      }
                      alt={res.productName}
                      width={50}
                      height={50}
                      className="rounded object-cover"
                    />
                    {res.productName}
                  </td>
                  <td className="py-3 px-4">{res.userName}</td>
                  <td className="py-3 px-4">{res.startDate}</td>
                  <td className="py-3 px-4">{res.endDate}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        res.status === "CONFIRMADA"
                          ? "bg-green-100 text-green-700"
                          : res.status === "CANCELADA"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {res.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex justify-center gap-3">
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() => handleConfirm(res.id)}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleCancel(res.id)}
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
