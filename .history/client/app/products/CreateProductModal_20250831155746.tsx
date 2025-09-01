"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Car, NewCar, carApi, categoryApi } from "@/state/api";

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
    category_id: 0,
    images: [],
    characteristics: [],
  });
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [characteristicsInput, setCharacteristicsInput] = useState("");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // Cargar categorías + inicializar formulario
  useEffect(() => {
    if (!isOpen) {
      newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
      return;
    }

    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const fetchedCategories = await categoryApi.getAll();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();

    if (car) {
      setFormData({
        name: car.name,
        description: car.description,
        carBrand: car.carBrand,
        pricePerHour: car.pricePerHour,
        category_id: car.category?.id || 0,
        images: [],
        characteristics: car.characteristics || [],
      });
      setCharacteristicsInput((car.characteristics || []).join(", "));

      // Normalizar URLs de imágenes
      setExistingImages(
        (car.images || []).map((img) =>
          img.startsWith("http") ? img : `${API_URL}/${img}`
        )
      );
      setNewImagePreviews([]);
    } else {
      resetForm();
    }
  }, [isOpen, car]);

  // Ajustar categoría después de cargar categorías
  useEffect(() => {
    if (categories.length > 0) {
      setFormData((prev) => {
        if (
          prev.category_id &&
          categories.some((cat) => cat.id === prev.category_id)
        ) {
          return prev;
        }
        return { ...prev, category_id: categories[0].id };
      });
    }
  }, [categories]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      carBrand: "",
      pricePerHour: 0,
      category_id: categories.length > 0 ? categories[0].id : 0,
      images: [],
      characteristics: [],
    });
    setCharacteristicsInput("");
    setExistingImages([]);
    setNewImagePreviews([]);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    const next =
      name === "pricePerHour" || name === "category_id" ? Number(value) : value;
    setFormData((prev) => ({
      ...prev,
      [name]: next,
    }));
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
    if (!files || files.length === 0) {
      setFormData((prev) => ({ ...prev, images: [] }));
      setNewImagePreviews([]);
      return;
    }

    const fileUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setNewImagePreviews(fileUrls);

    setFormData((prev) => ({
      ...prev,
      images: Array.from(files),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();
    const carData = {
      id: car?.id,
      name: formData.name,
      description: formData.description,
      carBrand: formData.carBrand,
      pricePerHour: formData.pricePerHour,
      category: { id: formData.category_id },
      characteristics: formData.characteristics,
    };

    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((img) => {
        data.append("images", img);
      });
    }
    data.append("car", JSON.stringify(carData));

    try {
      let savedCar: Car;
      if (car) {
        savedCar = await carApi.update(data, car.id);
      } else {
        savedCar = await carApi.create(data);
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
      <div className="bg-white rounded-md shadow-lg p-6 relative w-11/12 max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {car ? "Editar Auto" : "Crear Auto"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* nombre */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* descripción */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descripción
              </label>
              <input
                id="description"
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* marca */}
            <div>
              <label
                htmlFor="carBrand"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Marca
              </label>
              <input
                id="carBrand"
                type="text"
                name="carBrand"
                value={formData.carBrand}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* precio */}
            <div>
              <label
                htmlFor="pricePerHour"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Precio por hora
              </label>
              <input
                id="pricePerHour"
                type="number"
                name="pricePerHour"
                value={formData.pricePerHour}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* categoría */}
            <div>
              <label
                htmlFor="category_id"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Categoría
              </label>
              {loadingCategories ? (
                <p className="text-gray-500">Cargando categorías...</p>
              ) : categories.length === 0 ? (
                <p className="text-red-500">No hay categorías disponibles.</p>
              ) : (
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {/* características */}
            <div>
              <label
                htmlFor="characteristics"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Características (separadas por coma)
              </label>
              <input
                id="characteristics"
                type="text"
                value={characteristicsInput}
                onChange={handleCharacteristicsChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Imágenes */}
            <div className="md:col-span-2 mt-4">
              <label
                htmlFor="images"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Imágenes
              </label>
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {(existingImages.length > 0 || newImagePreviews.length > 0) && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                  <div className="flex flex-wrap gap-2">
                    {existingImages.map((src, index) => (
                      <img
                        key={`existing-${index}`}
                        src={src}
                        alt={`Imagen existente ${index + 1}`}
                        className="w-32 h-20 rounded-md shadow-md object-cover"
                      />
                    ))}
                    {newImagePreviews.map((src, index) => (
                      <img
                        key={`new-${index}`}
                        src={src}
                        alt={`Nueva imagen ${index + 1}`}
                        className="w-32 h-20 rounded-md shadow-md object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 mr-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-base">
              {car ? "Guardar cambios" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
