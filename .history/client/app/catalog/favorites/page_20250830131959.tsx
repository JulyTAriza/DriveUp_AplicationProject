"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/SideBarUser";
import { useAuth } from "@/components/AuthContext";
import { reservationApi, carApi, Reservation, Car } from "@/state/api";

interface FavoriteItem {
  reservation: Reservation;
  car: Car;
}

export default function FavoritesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // 🚦 Redirigir si no hay login
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  // 🔗 Cargar favoritos
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (!user) return;

        // Traer todas las reservas
        const reservations = await reservationApi.getAll();

        // Filtrar solo las del usuario actual y que sean favoritas
        const favReservations = reservations.filter(
          (r) => r.user_id === user.id && r.favorite
        );

        // Para cada reserva favorita, obtener info del auto
        const favWithCars: FavoriteItem[] = await Promise.all(
          favReservations.map(async (r) => {
            const car = await carApi.getById(r.car_id);
            return { reservation: r, car };
          })
        );

        setFavorites(favWithCars);
      } catch (err) {
        console.error("Error cargando favoritos:", err);
      }
    };

    fetchFavorites();
  }, [user]);

  // ❤️ Quitar de favoritos
  const removeFavorite = async (reservationId: number) => {
    try {
      await reservationApi.updateFavorite(reservationId, false);
      setFavorites((prev) =>
        prev.filter((f) => f.reservation.id !== reservationId)
      );
    } catch (err) {
      console.error("Error al quitar favorito:", err);
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
        <h1 className="text-2xl font-bold mb-4">Mis Favoritos</h1>
        {favorites.length === 0 ? (
          <p className="text-gray-600">No tienes autos favoritos aún.</p>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map(({ reservation, car }) => (
              <div
                key={reservation.id}
                className="p-4 bg-white rounded-xl shadow hover:shadow-md transition"
              >
                {car.imagePaths?.length > 0 && (
                  <Image
                    src={car.imagePaths[0]}
                    alt={car.name}
                    width={400}
                    height={200}
                    className="rounded-lg mb-2 object-cover"
                  />
                )}
                <h2 className="font-semibold">
                  {car.carBrand} {car.name}
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  ${car.pricePerHour} / hora
                </p>
                <button
                  onClick={() => removeFavorite(reservation.id)}
                  className="mt-2 text-sm text-red-500 hover:underline"
                >
                  Quitar de favoritos
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

