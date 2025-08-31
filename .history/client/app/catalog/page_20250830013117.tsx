"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import Sidebar from "@/components/SideBarUser";
import { Heart, Star } from "lucide-react";
import { carApi, Car, PuntuationApi } from "@/state/api";

export default function CatalogPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [ratings, setRatings] = useState<Record<number, number>>({}); // { carId: rating }

  // 🔒 Redirigir si no hay usuario
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  // 🔗 Traer autos desde el backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await carApi.getAll();
        setCars(data);
      } catch (err) {
        console.error("Error cargando autos:", err);
      }
    };
    fetchCars();
  }, []);

  // ❤️ Favoritos con backend
  const toggleFavorite = async (carId: number) => {
    try {
      const isFav = favorites.includes(carId);

      // Llamada al backend (marcar/desmarcar)
      await PuntuationApi.updateFavorite(carId, !isFav);

      // Actualizar estado local
      setFavorites((prev) =>
        isFav ? prev.filter((f) => f !== carId) : [...prev, carId]
      );
    } catch (err) {
      console.error("Error actualizando favorito:", err);
    }
  };

  // ⭐ Puntuación con backend
  const handleRating = async (carId: number, stars: number) => {
    try {
      await PuntuationApi.updatePuntuation(carId, stars);

      setRatings((prev) => ({
        ...prev,
        [carId]: stars,
      }));
    } catch (err) {
      console.error("Error actualizando puntuación:", err);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar con logout */}
      <Sidebar />

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto p-8">
        <h2 className="text-3xl font-bold mb-6">Catálogo de Autos</h2>

        {cars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Imagen */}
                {car.imagePaths?.length > 0 && (
                  <Image
                    src={car.imagePaths[0]}
                    alt={car.name}
                    width={400}
                    height={200}
                    className="object-cover w-full h-48"
                  />
                )}

                {/* Info */}
                <div className="p-4 flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {car.carBrand} {car.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      ${car.pricePerHour} / hora
                    </p>

                    {/* ⭐ Estrellas de valoración */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRating(car.id, star)}
                          className="focus:outline-none"
                        >
                          <Star
                            size={20}
                            className={`${
                              (ratings[car.id] || 0) >= star
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ❤️ Favorito */}
                  <button
                    onClick={() => toggleFavorite(car.id)}
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                  >
                    <Heart
                      size={22}
                      className={`${
                        favorites.includes(car.id)
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No hay autos disponibles en este momento.
          </p>
        )}
      </main>
    </div>
  );
}

