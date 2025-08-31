"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Car, NewCar, carApi } from "@/state/api";

type CreateCarModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (car: Car) => void;
  car: Car | null;
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
    category_id: 1,
    images: [],
    characteristics: [],
  });

  // Para el input de texto de características
  const [characteristicsInput, setCharacteristicsInput] = useState("");

  // Puedes obtener las categorías de tu API o tenerlas estáticamente
  const categories = [
    { id: 1, name: "Deportivo" },
    { id: 2, name: "SUV" },
  ];

  useEffect(() => {
    if (car) {
      setFormData({
        name: car.name,
        description: car.description,
        carBrand: car.carBrand,
        pricePerHour: car.pricePerHour,
        category_id: car.category?.id || 1,
        images: [],
        characteristics: car.characteristics || [],
      });
      setCharacteristicsInput((car.characteristics || []).join(", "));
    } else {
      resetForm();
    }
  }, [car]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      carBrand: "",
      pricePerHour: 0,
      category_id: 1,
      images: [],
      characteristics: [],
    });
    setCharacteristicsInput("");
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    const next =
      name === "pricePerHour" || name === "category_id" ? Number(value) : value;

    setFormData((prev) => ({
      ...prev,
      // cast porque el índice es dinámico
      [name]: next,
    } as unknown as NewCar));
  };

  const handleCharacteristicsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCharacteristicsInput(value);
    setFormData((prev) => ({
      ...prev,
      characteristics: value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setFormData((prev) => ({
      ...prev,
      images: Array.from(files),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let savedCar: Car;
      if (car) {
        // ✅ Pasamos NewCar, no FormData
        savedCar = await carApi.update(car.id, formData);
      } else {
        savedCar = await carApi.create(formData);
      }

      onCreated(savedCar);
      resetForm();
      onClose();
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
          <label htmlFor="name" className="block text-sm mb-1">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
            required
          />

          <label htmlFor="description" className="block text-sm mb-1">
            Descripción
          </label>
          <input
            id="description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
            required
          />

          <label htmlFor="carBrand" className="block text-sm mb-1">
            Marca
          </label>
          <input
            id="carBrand"
            type="text"
            name="carBrand"
            value={formData.carBrand}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
            required
          />

          <label htmlFor="pricePerHour" className="block text-sm mb-1">
            Precio por hora
          </label>
          <input
            id="pricePerHour"
            type="number"
            name="pricePerHour"
            value={formData.pricePerHour}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
            required
          />

          <label htmlFor="category_id" className="block text-sm mb-1">
            Categoría
          </label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <label htmlFor="characteristics" className="block text-sm mb-1">
            Características (separadas por coma)
          </label>
          <input
            id="characteristics"
            type="text"
            value={characteristicsInput}
            onChange={handleCharacteristicsChange}
            className="w-full p-2 border rounded mb-3"
          />

          <label htmlFor="images" className="block text-sm mb-1">
            Imágenes
          </label>
          <input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded mb-3"
          />

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
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

