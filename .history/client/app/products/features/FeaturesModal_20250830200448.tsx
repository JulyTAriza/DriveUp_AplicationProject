"use client";

import { useState, useEffect } from "react";
import { carApi, Car } from "@/state/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (updatedCar: Car) => void;
  car: Car | null; // Usamos un objeto Car para editar sus características
}

export default function FeaturesModal({ isOpen, onClose, onUpdated, car }: Props) {
  const [characteristics, setCharacteristics] = useState<string[]>([]);
  const [newCharacteristic, setNewCharacteristic] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (car) {
      setCharacteristics(car.characteristics || []);
    }
  }, [car]);

  const handleAddCharacteristic = () => {
    if (newCharacteristic.trim() !== "") {
      setCharacteristics([...characteristics, newCharacteristic.trim()]);
      setNewCharacteristic("");
    }
  };

  const handleRemoveCharacteristic = (indexToRemove: number) => {
    setCharacteristics(characteristics.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!car) {
      setError("No se ha seleccionado un auto para actualizar.");
      return;
    }

    try {
      const updatedCar = { ...car, characteristics };
      const savedCar = await carApi.updateCharacteristics(updatedCar);
      onUpdated(savedCar);
      onClose();
    } catch (err) {
      console.error("Error al actualizar características:", err);
      setError("Error al guardar las características. Inténtalo de nuevo.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">
          {"Editar Características de " + (car?.name || "")}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            {characteristics.map((char, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2">
                <span>{char}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCharacteristic(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nueva característica"
              value={newCharacteristic}
              onChange={(e) => setNewCharacteristic(e.target.value)}
              className="w-full border rounded p-2"
            />
            <button
              type="button"
              onClick={handleAddCharacteristic}
              className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-700"
            >
              Agregar
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-700"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}