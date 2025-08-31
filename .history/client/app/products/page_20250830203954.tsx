"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Search, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import CreateCarModal from "./CreateProductModal";
import { carApi, Car } from "@/state/api";
import SideBar from "@/components/SideBar";

export default function ProductosPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // cargar autos al inicio
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

  // crear o actualizar auto
  const handleCreated = (savedCar: Car) => {
    if (selectedCar) {
      setCars((prev) =>
        prev.map((c) => (c.id === savedCar.id ? savedCar : c))
      );
    } else {
      setCars((prev) => [...prev, savedCar]);
    }
    setIsModalOpen(false);
    setSelectedCar(null);
  };

  // eliminar auto
  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que quieres eliminar este auto?")) {
      try {
        await carApi.delete(id);
        setCars((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        console.error("Error eliminando auto:", err);
      }
    }
  };

  // editar auto
  const handleEdit = (car: Car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  // filtrar autos
  const filteredCars = cars.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex w-full min-h-screen">
      {/* SIDEBAR */}
      <SideBar />

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 mx-auto pb-5 p-6">
        {/* SEARCH */}
        <div className="mb-6 flex items-center border-2 border-gray-200 rounded">
          <Search className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Buscar autos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Autos</h1>
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
            onClick={() => {
              setSelectedCar(null);
              setIsModalOpen(true);
            }}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Crear Auto
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="py-3 px-4 text-left">Foto</th>
                <th className="py-3 px-4 text-left">Nombre</th>
                <th className="py-3 px-4 text-left">Marca</th>
                <th className="py-3 px-4 text-left">Precio/Hora</th>
                <th className="py-3 px-4 text-center">Operación</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No encontramos autos
                  </td>
                </tr>
              ) : (
                filteredCars.map((car) => (
                  <tr key={car.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <Image
                        src={
                          car.imagePaths && car.imagePaths.length > 0
                            ? car.imagePaths[0]
                            : "/cars/default.jpg"
                        }
                        alt={car.name}
                        width={60}
                        height={60}
                        className="rounded object-cover"
                      />
                    </td>
                    <td className="py-3 px-4">{car.name}</td>
                    <td className="py-3 px-4">{car.carBrand}</td>
                    <td className="py-3 px-4">
                      ${car.pricePerHour?.toFixed(2) || 'N/A'}
                    </td>
                    <td className="py-3 px-4 flex justify-center gap-3">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEdit(car)}
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(car.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL CREAR/EDITAR */}
        <CreateCarModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCar(null);
          }}
          onCreated={handleCreated}
          car={selectedCar}
        />
      </div>
    </div>
  );
}

