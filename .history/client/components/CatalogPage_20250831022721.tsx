import CategoriesComponent from "@/components/CategoriesComponent";
import { useState, useEffect } from "react";
import { carApi, Car } from "@/state/api";

export default function CatalogPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);

  // 🔗 Cargar todos los autos al inicio
  useEffect(() => {
    const fetchCars = async () => {
      const data = await carApi.getAll();
      setCars(data);
      setFilteredCars(data); // por defecto, mostrar todos
    };
    fetchCars();
  }, []);

  // 🔍 Filtrar autos por categoría
  const handleSelectCategory = (categoryId: number) => {
    const filtered = cars.filter((c) => c.category?.id === categoryId);
    setFilteredCars(filtered);
  };

  return (
    <main className="p-8">
      {/* 🔹 Módulo de categorías */}
      <CategoriesComponent onSelectCategory={handleSelectCategory} />

      {/* 🔹 Lista de autos filtrados */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <div key={car.id} className="p-4 bg-white shadow rounded-xl">
              <h3 className="font-semibold">{car.carBrand} {car.name}</h3>
              <p className="text-sm text-gray-500">{car.category?.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No hay autos en esta categoría</p>
      )}
    </main>
  );
}
