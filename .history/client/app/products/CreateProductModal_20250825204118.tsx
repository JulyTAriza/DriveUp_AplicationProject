"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Car, NewCar, carApi } from "@/state/api"; // ajusta la ruta de api.ts si es necesario

type CreateCarModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (car: Car) => void; // para refrescar lista al crear/editar
  car: Car | null; // si viene un auto, es edición
};

export default function CreateCarModal({
  isOpen,
  onClose,
  onCreated,
  car,
}: CreateCarModalProps) {
  const [formData, setFormData] = useState<NewCar>({
    name: "",
    description: "",
    carBrand: "",
    pricePerHour: 0,
    category_id: 1, // valor por defecto
    images: [],
  });

  // Inicializar el formulario si es edición
  useEffect(() => {
    if (car) {
      setFormData({
        name: car.name,
        description: car.description,
        carBrand: car.carBrand,
        pricePerHour: car.pricePerHour,
        category_id: car.category?.id || 1,
        images: [], // no cargamos imágenes anteriores
      });
    } else {
      setFormData({
        name: "",
        description: "",
        carBrand: "",
        pricePerHour: 0,
        category_id: 1,
        images: [],
      });
    }
  }, [car]);

  // Manejar cambios de texto/números
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "pricePerHour" ? Number(value) : value,
    }));
  };

  // Manejar carga de archivos
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return; // si está vacío, no hace nada

    setFormData((prev) => ({
      ...prev,
      images: Array.from(files), // ahora TypeScript no se queja
    }));
  };

  // Enviar formulario
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let savedCar: Car;
      if (car) {
        savedCar = await carApi.update(car.id, formData);
      } else {
        savedCar = await carApi.create(formData);
      }

      onCreated(savedCar); // notificar al padre
      onClose(); // cerrar modal
    } catch (err) {
      console.error("Error guardando carro:", err);
      alert("Hubo un error guardando el auto.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 flex items-center justify-center">
      <div className="bg-white rounded-md shadow-lg w-96 p-6 relative">
        <h2 className="text-xl font-bold mb-4">
          {car ? "Editar Auto" : "Crear Auto"}
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="block text-sm mb-1">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
            required
          />

          <label className="block text-sm mb-1">Descripción</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
            required
          />

          <label className="block text-sm mb-1">Marca</label>
          <input
            type="text"
            name="carBrand"
            value={formData.carBrand}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
            required
          />

          <label className="block text-sm mb-1">Precio por hora</label>
          <input
            type="number"
            name="pricePerHour"
            value={formData.pricePerHour}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
            required
          />

          <label className="block text-sm mb-1">Imágenes</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded mb-3"
          />

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 bg-gray-500 text-white rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              {car ? "Guardar cambios" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
