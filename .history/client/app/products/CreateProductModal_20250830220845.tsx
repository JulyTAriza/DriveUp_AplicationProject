// Archivo: CreateCarModal.tsx
"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Car, NewCar, carApi, categoryApi, DateRange } from "@/state/api";

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
    reservedDates: [],
  });
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [characteristicsInput, setCharacteristicsInput] = useState("");
  const [reservDatesInput, setReservDatesInput] = useState("");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );

  // ✅ ÚNICO useEffect para manejar todo: carga de categorías e inicialización del formulario
  useEffect(() => {
    if (!isOpen) {
      // Si el modal se cierra, reinicia el estado
      resetForm();
      setLoadingCategories(true);
      return;
    }

    // Lógica para cargar las categorías del backend
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await categoryApi.getAll();
        setCategories(fetchedCategories);

        if (car) {
          // Modo edición: inicializa con los datos del auto
          const datesFormatted = (car.reservedDates || [])
            .map((d) => `${d.rentalStart}-${d.rentalEnd}`)
            .join(", ");
          setFormData({
            name: car.name,
            description: car.description,
            carBrand: car.carBrand,
            pricePerHour: car.pricePerHour,
            category_id:
              car.category?.id ||
              (fetchedCategories.length > 0 ? fetchedCategories[0].id : 0),
            images: [],
            characteristics: car.characteristics || [],
            reservedDates: car.reservedDates || [],
          });
          setCharacteristicsInput((car.characteristics || []).join(", "));
          setReservDatesInput(datesFormatted);
        } else {
          // Modo creación: inicializa con valores por defecto
          resetForm();
          if (fetchedCategories.length > 0) {
            setFormData((prev) => ({
              ...prev,
              category_id: fetchedCategories[0].id,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [isOpen, car]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      carBrand: "",
      pricePerHour: 0,
      category_id: 1, // Se establecerá el ID correcto al cargar las categorías
      images: [],
      characteristics: [],
      reservedDates: [],
    });
    setCharacteristicsInput("");
    setReservDatesInput("");
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
  
  const handleReservDatesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setReservDatesInput(value);
    const dateRanges: DateRange[] = value
      .split(",")
      .map((item) => {
        const parts = item.split("-").map((part) => part.trim());
        if (parts.length === 2) {
          return { rentalStart: parts[0], rentalEnd: parts[1] };
        }
        return null;
      })
      .filter((d): d is DateRange => d !== null);
    setFormData((prev) => ({
      ...prev,
      reservedDates: dateRanges,
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
    const data = new FormData();
    const carData = {
      id: car?.id,
      name: formData.name,
      description: formData.description,
      carBrand: formData.carBrand,
      pricePerHour: formData.pricePerHour,
      category: { id: formData.category_id },
      characteristics: formData.characteristics,
      reservedDates: formData.reservedDates || [],
    };
    data.append("car", JSON.stringify(carData));
    if (formData.images && formData.images.length > 0) {
      formData.images.forEach((img) => {
        data.append("images", img);
      });
    }

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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
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
              <label htmlFor="carBrand" className="block text-sm font-medium text-gray-700 mb-1">
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
              <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-700 mb-1">
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
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
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
              <label htmlFor="characteristics" className="block text-sm font-medium text-gray-700 mb-1">
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
            {/* reservDates */}
            <div>
              <label htmlFor="reservDates" className="block text-sm font-medium text-gray-700 mb-1">
                Fechas reservadas (YYYY-MM-DD-YYYY-MM-DD separadas por coma)
              </label>
              <input
                id="reservDates"
                type="text"
                value={reservDatesInput}
                onChange={handleReservDatesChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2025-09-01-2025-09-05, 2025-10-10-2025-10-15"
              />
            </div>
          </div>
          {/* imágenes - ocupa toda la fila */}
          <div className="mt-4">
            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
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
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              {car ? "Guardar cambios" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}