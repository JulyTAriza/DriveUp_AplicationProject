"use client";
import { useEffect, useState } from "react";
import { carApi, Car } from "@/state/api";
import { Heart, Share2 } from "lucide-react";

export default function CatalogoPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await carApi.getAll();
        setCars(data);
      } catch (error) {
        console.error("Error al cargar autos:", error);
      }
    };
    fetchCars();
  }, []);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const shareCar = (car: Car) => {
    const shareData = {
      title: car.name,
      text: `Mira este carro: ${car.name} - ${car.carBrand} a solo $${car.pricePerHour}/hora`,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch((err) =>
        console.error("Error al compartir:", err)
      );
    } else {
      alert("Tu navegador no soporta compartir");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Catálogo de Autos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div
            key={car.id}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={
                car.imagePaths && car.imagePaths.length > 0
                  ? car.imagePaths[0]
                  : "https://via.placeholder.com/400x250.png?text=Car"
              }
              alt={car.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{car.name}</h2>
              <p className="text-sm text-gray-600">{car.description}</p>
              <p className="mt-2 font-bold text-green-600">
                ${car.pricePerHour} / hora
              </p>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => toggleFavorite(car.id)}
                  className={`flex items-center gap-1 ${
                    favorites.includes(car.id)
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  <Heart
                    size={20}
                    fill={favorites.includes(car.id) ? "red" : "none"}
                  />
                  {favorites.includes(car.id) ? "Favorito" : "Guardar"}
                </button>
                <button
                  onClick={() => shareCar(car)}
                  className="text-blue-500 flex items-center gap-1"
                >
                  <Share2 size={20} />
                  Compartir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
