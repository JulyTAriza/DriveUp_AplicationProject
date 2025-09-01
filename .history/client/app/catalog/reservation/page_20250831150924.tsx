"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/SideBarUser";
import { reservationApi, Reservation, carApi, Car } from "@/state/api";
import CreateReservationModal from "./CreateReservationModal";

interface ReservationItem {
  reservation: Reservation;
  car: Car;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<ReservationItem[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [showModal, setShowModal] = useState(false);

  // 📌 Cargar reservas + autos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await reservationApi.getAll();
        const autos = await carApi.getAll();

        // 🔗 Combinar reservas con info del auto
        const withCars: ReservationItem[] = await Promise.all(
          res.map(async (r) => {
            const car = autos.find((c) => c.id === r.car_id) || (await carApi.getById(r.car_id));
            return { reservation: r, car };
          })
        );

        setReservations(withCars);
        setCars(autos);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };
    fetchData();
  }, []);

  // 📌 Nueva reserva
  const handleReservationCreated = (newRes: Reservation) => {
    const car = cars.find((c) => c.id === newRes.car_id);
    if (car) {
      setReservations((prev) => [...prev, { reservation: newRes, car }]);
    }
  };

  // 📌 Cancelar reserva
  const handleCancelReservation = async (reservation: Reservation) => {
    try {
      const updated = await reservationApi.update({
        ...reservation,
        status: "CANCELADA",
      });

      setReservations((prev) =>
        prev.map((item) =>
          item.reservation.id === reservation.id
            ? { ...item, reservation: updated }
            : item
        )
      );
    } catch (err) {
      console.error("Error al cancelar la reserva:", err);
    }
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
            {reservations.map(({ reservation, car }) => (
              <div
                key={reservation.id}
                className="p-4 bg-white rounded-xl shadow flex justify-between"
              >
                <div>
                  <h2 className="font-semibold">
                    {car.carBrand} {car.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {reservation.rentalStart} → {reservation.rentalEnd}
                  </p>
                  <p
                    className={`text-sm mt-1 font-medium ${
                      reservation.status === "CONFIRMADA"
                        ? "text-green-600"
                        : reservation.status === "CANCELADA"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    Estado: {reservation.status}
                  </p>
                </div>
                {reservation.status !== "CANCELADA" && (
                  <button
                    onClick={() => handleCancelReservation(reservation)}
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
