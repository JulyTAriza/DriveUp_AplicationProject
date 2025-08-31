"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Car, NewCar } from "@/state/api";

type CreateProductoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: NewCar) => void;
  producto: Car | null;
};

export default function CreateProductoModal({
  isOpen,
  onClose,
  onCreate,
  producto,
}: CreateProductoModalProps) {
  const [formData, setFormData] = useState<NewCar>({
    name: "",
    description: "",
    carBrand: "",
    pricePerHour: 0,
    category_id: 1,
    images: [],
  });

  useEffect(() => {
    if (producto) {
      setFormData({
        name: producto.name,
        description: producto.description,
        carBrand: producto.carBrand,
        pricePerHour: producto.pricePerHour,
        category_id: producto.category?.id || 1,
        images: [],
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
  }, [producto]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "pricePerHour" || name === "category_id"
          ? Number(value)
          : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({
        ...prev,
        images: Array.from(e.target.files),
      }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      alert("Completa todos los campos");
      return;
    }
    onCreate(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 flex items-center justify-center">
      <div className="bg-white rounded-md shadow-lg w-96 p-6 relative">
        <h2 className="text-xl font-bold mb-4">
          {producto ? "Editar Auto" : "Crear Auto"}
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
          <label className="block text-sm mb-1">Categoría (ID)</label>
          <input
            type="number"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
            required
          />
          <label className="block text-sm mb-1">Imágenes</label>
          <input
            type="file"
            multiple
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
              {producto ? "Guardar cambios" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
