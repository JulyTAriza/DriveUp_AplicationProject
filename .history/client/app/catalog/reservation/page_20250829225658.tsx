"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/SideBarUser";
import { reservationApi, Reservation, carApi, Car } from "@/state/api";
import CreateReservationModal from "./CreateReservationModal";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await reservationApi.getAll();
        setReservations(res);

        const autos = await carApi.getAll();
        setCars(autos);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    fetchData();
  }, []);

  const handleReservationCreated = (newRes: Reservation) => {
    setReservations((prev) => [...prev, newRes]);
  };

  const handleCancelReservation = async (id: number) => {
    await reservationApi.updateStatus(id, "CANCELADA");
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "CANCELADA" } : r))
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Mis Reservas</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Nueva Reserva
          </button>
        </div>

        {reservations.length === 0 ? (
          <p className="text-gray-600">No tienes reservas activas.</p>
        ) : (
          <div className="grid gap-4">
            {reservations.map((r) => (
              <div
                key={r.id}
                className="p-4 bg-white rounded-xl shadow flex justify-between"
              >
                <div>
                  <h2 className="font-semibold">Reserva #{r.id}</h2>
                  <p className="text-sm text-gray-500">
                    Auto ID: {r.car_id} – {r.rentalStart} → {r.rentalEnd}
                  </p>
                  <p
                    className={`text-sm mt-1 font-medium ${
                      r.status === "CONFIRMADA"
                        ? "text-green-600"
                        : r.status === "CANCELADA"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    Estado: {r.status}
                  </p>
                </div>
                {r.status !== "CANCELADA" && (
                  <button
                    onClick={() => handleCancelReservation(r.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <CreateReservationModal
            cars={cars}
            onClose={() => setShowModal(false)}
            onCreated={handleReservationCreated}
          />
        )}
      </main>
    </div>
  );
}
