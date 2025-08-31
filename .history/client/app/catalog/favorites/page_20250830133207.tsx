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

  // ❤️ Quitar de favoritos con PUT
  const removeFavorite = async (item: FavoriteItem) => {
    try {
      const updated = await reservationApi.update({
        ...item.reservation,
        favorite: false,
      });

      setFavorites((prev) =>
        prev.filter((f) => f.reservation.id !== updated.id)
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
          <div className="overflow-x-auto bg-white shadow rounded-xl">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="bg-gray-200 text-gray-700 text-sm uppercase">
                <tr>
                  <th className="px-4 py-3">Imagen</th>
                  <th className="px-4 py-3">Auto</th>
                  <th className="px-4 py-3">Precio / Hora</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {favorites.map((item) => (
                  <tr
                    key={item.reservation.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      {item.car.imagePaths?.length > 0 && (
                        <Image
                          src={item.car.imagePaths[0]}
                          alt={item.car.name}
                          width={120}
                          height={80}
                          className="rounded-lg object-cover"
                        />
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {item.car.carBrand} {item.car.name}
                    </td>
                    <td className="px-4 py-3">${item.car.pricePerHour}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => removeFavorite(item)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Quitar de favoritos
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

