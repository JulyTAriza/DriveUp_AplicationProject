"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Search, Pencil, Trash2 } from "lucide-react";
import UserSidebar from "@/components/SideBar";
import FeaturesModal from "@/components/FeaturesModal"; // Importa el modal
import { carApi, Car } from "@/state/api"; // Importa la API y el tipo Car

export default function FeaturesPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carga los autos al montar el componente
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const allCars = await carApi.getAll();
        setCars(allCars);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError("Error al cargar los autos. Inténtalo de nuevo.");
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleEdit = (car: Car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleDelete = async (carId: number) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este auto y sus características?");
    if (!confirmDelete) return;

    try {
      await carApi.delete(carId);
      setCars(cars.filter((car) => car.id !== carId));
    } catch (err) {
      console.error("Error deleting car:", err);
      alert("Error al eliminar el auto.");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
  };

  const handleCarUpdated = (updatedCar: Car) => {
    setCars(cars.map(c => c.id === updatedCar.id ? updatedCar : c));
  };

  if (loading) {
    return (
      <div className="text-center mt-10">Cargando autos...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">{error}</div>
    );
  }

  return (
    <div className="mx-auto pb-5 w-full">
      <div className="mb-6 flex items-center border-2 border-gray-200 rounded">
        <Search className="w-5 h-5 text-gray-500 m-2" />
        <input
          className="w-full py-2 px-4 rounded bg-white"
          placeholder="Buscar características..."
          readOnly
        />
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Características</h1>
        <button 
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => {
            alert("No se puede crear una característica sin un auto. Edita un auto existente para agregar características.");
          }}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Crear Característica
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-4 text-left">Auto</th>
              <th className="py-3 px-4 text-left">Características</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car) => (
              <tr key={car.id}>
                <td className="py-3 px-4 font-semibold">{car.name}</td>
                <td className="py-3 px-4">
                  <ul className="list-disc list-inside">
                    {car.characteristics.length > 0 ? (
                      car.characteristics.map((char, index) => (
                        <li key={index}>{char}</li>
                      ))
                    ) : (
                      <span className="text-gray-400">Sin características</span>
                    )}
                  </ul>
                </td>
                <td className="py-3 px-4 flex justify-center gap-3">
                  <button onClick={() => handleEdit(car)} className="text-blue-500 hover:text-blue-700">
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(car.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Renderiza el modal */}
      <FeaturesModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onUpdated={handleCarUpdated}
        car={selectedCar}
      />
    </div>
  );
}