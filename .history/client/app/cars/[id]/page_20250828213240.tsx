// En tu archivo /app/cars/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { carApi, Car } from "@/state/api"; 
import { useAuth } from "@/components/AuthContext";

interface CarDetailsPageProps {
  params: { id: string };
}

export default function CarDetailsPage({ params }: CarDetailsPageProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth(); // ✅ Obtenemos el estado de carga
  const [car, setCar] = useState<Car | null>(null);
  const { id } = params;

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const data = await carApi.getById(Number(id));
        setCar(data);
      } catch (error) {
        console.error("Error fetching car details:", error);
        setCar(null);
      }
    };
    fetchCarDetails();
  }, [id]);

  // ✅ ¡Esta es la clave! Si el contexto de autenticación está cargando o el auto no se ha cargado, se muestra un mensaje de carga.
  if (isLoading || !car) {
    return <div>Cargando detalles del auto...</div>;
  }

  // Lógica para el botón "Reservar"
  const handleReservarClick = () => {
    // Ahora, el valor de `user` es confiable porque ya se ha cargado
    if (!user) {
      router.push('/login');
    } else {
      router.push(`/cars/${car.id}/book`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Lado izquierdo: Galería de imágenes */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg">
            {car.imagePaths && car.imagePaths.length > 0 && (
              <Image 
                src={car.imagePaths[0]} 
                alt={`${car.carBrand} ${car.name}`} 
                fill 
                className="object-cover"
              />
            )}
          </div>
          <div className="grid grid-cols-3 gap-4">
            {car.imagePaths && car.imagePaths.slice(1, 4).map((imagePath, index) => (
              <div key={index} className="relative w-full h-24 rounded-lg overflow-hidden shadow-md">
                <Image 
                  src={imagePath} 
                  alt={`${car.carBrand} ${car.name} - ${index + 2}`} 
                  fill 
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Lado derecho: Detalles del auto */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{car.carBrand} {car.name}</h1>
          <p className="text-xl text-blue-600 font-semibold">${car.pricePerHour} / hora</p>
          <p className="text-gray-700">{car.description}</p>

          <div className="flex flex-col gap-2 mt-4">
            <h3 className="font-semibold text-lg">Características:</h3>
            <ul className="list-disc list-inside text-gray-700">
              {car.characteristics?.map((char, index) => (
                <li key={index}>{char}</li>
              ))}
            </ul>
          </div>
          
          <div className="flex justify-between mt-4">
            <span className="font-semibold text-gray-600">Categoría:</span>
            <span className="text-gray-800">{car.category?.name}</span>
          </div>

          <button 
            onClick={handleReservarClick}
            className="w-full py-3 mt-8 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
          >
            Reservar este Auto
          </button>
        </div>
      </div>
    </div>
  );
}