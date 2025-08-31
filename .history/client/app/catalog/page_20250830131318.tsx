"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import Sidebar from "@/components/SideBarUser";
import { carApi, Car } from "@/state/api";

export default function CatalogPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);

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
                <div className="p-4">
                  <h3 className="text-lg font-semibold">
                    {car.carBrand} {car.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Categoría: {car.category?.name}
                  </p>
                  <p className="text-sm text-gray-500 mb-2">
                    ${car.pricePerHour} / hora
                  </p>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    {car.description}
                  </p>

                  {/* Botón ver detalle */}
                  <button
                    onClick={() => router.push(`/autos/${car.id}`)}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Ver Detalle
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


