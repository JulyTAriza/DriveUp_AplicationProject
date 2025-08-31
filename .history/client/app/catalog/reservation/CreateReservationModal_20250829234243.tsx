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
  const [pickUp, setPickUp] = useState(""); // 🔹 Lugar de recogida
  const [rentalStart, setRentalStart] = useState("");
  const [rentalEnd, setRentalEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Forzar formato YYYY-MM-DD
  const formatDate = (date: string) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // => "YYYY-MM-DD"
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
        user_id: Number(localStorage.getItem("userId")), // desde auth
        pickUp,
        rentalStart: formatDate(rentalStart),
        rentalEnd: formatDate(rentalEnd),
        status: "PENDIENTE", // 🔹 siempre inicia como pendiente
      };

      console.log("📤 Payload enviado:", newRes); // debug

      const res = await reservationApi.create(newRes);
      onCreated(res);
      onClose();
    } catch (err) {
      console.error("❌ Error creando reserva:", err);
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

        <label className="block text-sm mb-1">Fecha inicio</label>
        <input
          type="date"
          className="w-full border rounded p-2 mb-3"
          value={rentalStart}
          onChange={(e) => setRentalStart(e.target.value)}
        />

        <label className="block text-sm mb-1">Fecha fin</label>
        <input
          type="date"
          className="w-full border rounded p-2 mb-3"
          value={rentalEnd}
          onChange={(e) => setRentalEnd(e.target.value)}
        />

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

