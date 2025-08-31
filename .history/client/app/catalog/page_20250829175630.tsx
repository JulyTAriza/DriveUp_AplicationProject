"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import Sidebar from "@/components/SideBarUser"; // ✅ Sidebar para usuario
import { Heart } from "lucide-react";

interface Car {
  id: number;
  name: string;
  brand: string;
  pricePerHour: number;
  imagePath: string;
}

const mockCars: Car[] = [
  {
    id: 1,
    name: "Mustang GT",
    brand: "Ford",
    pricePerHour: 120,
    imagePath:
      "https://images.unsplash.com/photo-1549480017-d711c1822709?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Model S",
    brand: "Tesla",
    pricePerHour: 200,
    imagePath:
      "https://images.unsplash.com/photo-1627255160677-24a640106263?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Aventador",
    brand: "Lamborghini",
    pricePerHour: 300,
    imagePath:
      "https://images.unsplash.com/photo-1571241940954-46b5d2df807e?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function CatalogPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]); // IDs de autos favoritos

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    setCars(mockCars);
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
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
      {/* ✅ Sidebar sin props (ya maneja logout internamente) */}
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
                <Image
                  src={car.imagePath}
                  alt={car.name}
                  width={400}
                  height={200}
                  className="object-cover w-full h-48"
                />
                <div className="p-4 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {car.brand} {car.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      ${car.pricePerHour} / hora
                    </p>
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
                      Reservar
                    </button>
                  </div>

                  {/*  Icono de favorito */}
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

