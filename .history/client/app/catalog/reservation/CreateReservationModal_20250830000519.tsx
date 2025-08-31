"use client";

import { useState } from "react";
import { reservationApi, NewReservation, Reservation, Car } from "@/state/api";

interface Props {
  cars: Car[];
  onClose: () => void;
  onCreated: (res: Reservation) => void;
}

export default function CreateReservationModal({
  cars,
  onClose,
  onCreated,
}: Props) {
  const [selectedCar, setSelectedCar] = useState<number | null>(null);
  const [pickUp, setPickUp] = useState("");
  const [rentalStart, setRentalStart] = useState("");
  const [rentalEnd, setRentalEnd] = useState("");
  const [status, setStatus] = useState<"PENDIENTE" | "CONFIRMADA">("PENDIENTE");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Forzar formato: convertir DD/MM/YYYY → YYYY-MM-DD
  const formatDate = (date: string) => {
    if (!date) return "";
    const parts = date.split("/"); // espera dd/mm/yyyy
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return date; // si ya viene en yyyy-mm-dd lo deja igual
  };

  const handleCreate = async () => {
    if (!selectedCar || !pickUp || !rentalStart || !rentalEnd) {
      setError("⚠️ Por favor completa todos los campos");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const newRes: NewReservation = {
        car_id: selectedCar,
        user_id: Number(localStorage.getItem("userId")),
        pickUp,
        rentalStart: formatDate(rentalStart),
        rentalEnd: formatDate(rentalEnd),
        status,
      };

      console.log("📤 Payload enviado:", newRes);

      const res = await reservationApi.create(newRes);
      onCreated(res);
      onClose();
    } catch (err: any) {
      console.error("❌ Error creando reserva:", err.response?.data || err);
      setError("Error al crear la reserva 😥");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Nueva Reserva</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <label className="block text-sm mb-1">Auto</label>
        <select
          className="w-full border rounded p-2 mb-3"
          onChange={(e) => setSelectedCar(Number(e.target.value))}
        >
          <option value="">Selecciona un auto</option>
          {cars.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({c.carBrand})
            </option>
          ))}
        </select>

        <label className="block text-sm mb-1">Lugar de recogida</label>
        <input
          type="text"
          className="w-full border rounded p-2 mb-3"
          placeholder="Ej: Medellín"
          value={pickUp}
          onChange={(e) => setPickUp(e.target.value)}
        />

        <label className="block text-sm mb-1">Fecha inicio (YYYY-MM-DD)</label>
        <input
          type="text"
          className="w-full border rounded p-2 mb-3"
          placeholder="YYYY-MM-DD"
          value={rentalStart}
          onChange={(e) => setRentalStart(e.target.value)}
        />

        <label className="block text-sm mb-1">Fecha fin (YYYY-MM-DD)</label>
        <input
          type="text"
          className="w-full border rounded p-2 mb-3"
          placeholder="YYYY-MM-DD"
          value={rentalEnd}
          onChange={(e) => setRentalEnd(e.target.value)}
        />

        <label className="block text-sm mb-1">Estado</label>
        <select
          className="w-full border rounded p-2 mb-3"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as "PENDIENTE" | "CONFIRMADA")
          }
        >
          <option value="PENDIENTE">Pendiente</option>
          <option value="CONFIRMADA">Confirmada</option>
        </select>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}




