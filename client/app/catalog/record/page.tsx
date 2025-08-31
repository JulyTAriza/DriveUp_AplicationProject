"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Sidebar from "@/components/SideBarUser";
import { useAuth } from "@/components/AuthContext";
import { reservationApi, carApi, Reservation, Car } from "@/state/api";
import { Star, Heart } from "lucide-react";

interface ReservationItem {
  reservation: Reservation;
  car: Car;
}

export default function HistoryPage() {
  const { user, isLoading } = useAuth();
  const [reservations, setReservations] = useState<ReservationItem[]>([]);

  // 🔗 Traer reservas del usuario
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        if (!user) return;

        const res = await reservationApi.getAll();
        const userReservations = res.filter((r) => r.user_id === user.id);

        const withCars: ReservationItem[] = await Promise.all(
          userReservations.map(async (r) => {
            const car = await carApi.getById(r.car_id);
            return { reservation: r, car };
          })
        );

        setReservations(withCars);
      } catch (err) {
        console.error("Error cargando reservas:", err);
      }
    };

    fetchReservations();
  }, [user]);

  // ⭐ Actualizar puntuación con PUT
  const handleRating = async (reservation: Reservation, stars: number) => {
    try {
      const updated = await reservationApi.update({
        ...reservation,
        stars,
      });
      setReservations((prev) =>
        prev.map((item) =>
          item.reservation.id === reservation.id
            ? { ...item, reservation: updated }
            : item
        )
      );
    } catch (err) {
      console.error("Error al puntuar:", err);
    }
  };

  // ❤️ Favoritos con PUT
  const toggleFavorite = async (reservation: Reservation) => {
    try {
      const updated = await reservationApi.update({
        ...reservation,
        favorite: !reservation.favorite,
      });
      setReservations((prev) =>
        prev.map((item) =>
          item.reservation.id === reservation.id
            ? { ...item, reservation: updated }
            : item
        )
      );
    } catch (err) {
      console.error("Error al actualizar favorito:", err);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Historial de Reservas</h1>
        {reservations.length === 0 ? (
          <p className="text-gray-600">No tienes reservas aún.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reservations.map(({ reservation, car }) => (
              <div
                key={reservation.id}
                className="p-4 bg-white rounded-xl shadow hover:shadow-md transition"
              >
                {/* Imagen */}
                {car.imagePaths?.length > 0 && (
                  <Image
                    src={car.imagePaths[0]}
                    alt={car.name}
                    width={400}
                    height={200}
                    className="rounded-lg mb-2 object-cover"
                  />
                )}

                {/* Info */}
                <h2 className="font-semibold">
                  {car.carBrand} {car.name}
                </h2>
                <p className="text-sm text-gray-500 mb-1">
                  Estado:{" "}
                  <span
                    className={`font-semibold ${
                      reservation.status === "CONFIRMADA"
                        ? "text-green-600"
                        : reservation.status === "CANCELADA"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {reservation.status}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  Desde {reservation.rentalStart} hasta {reservation.rentalEnd}
                </p>

                {/* ⭐ Puntuación */}
                {reservation.status === "CONFIRMADA" ? (
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(reservation, star)}
                        className="focus:outline-none"
                      >
                        <Star
                          size={20}
                          className={`${
                            (reservation.stars || 0) >= star
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 mb-2">
                    Solo puedes puntuar cuando la reserva esté confirmada.
                  </p>
                )}

                {/* ❤️ Favorito */}
                <button
                  onClick={() => toggleFavorite(reservation)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <Heart
                    size={22}
                    className={`${
                      reservation.favorite
                        ? "text-red-500 fill-red-500"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


