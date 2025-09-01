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
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [characteristicsInput, setCharacteristicsInput] = useState("");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/$/, "");

  // Normaliza una imagen (si viene relativa la hace absoluta usando API_URL)
  const normalizeImage = (img: string) => {
    if (!img) return img;
    // si ya es http(s)
    if (/^https?:\/\//i.test(img)) return img;
    // quitar slashes sobrantes
    const cleanedBase = API_URL.replace(/\/$/, "");
    const cleanedPath = img.replace(/^\//, "");
    return `${cleanedBase}/${cleanedPath}`;
  };

  // Función para cargar categorías (se puede re-intentar)
  const fetchCategories = async () => {
    console.log("Fetch categories - iniciando...");
    setLoadingCategories(true);
    setCategoriesError(null);
    try {
      const fetchedCategories = await categoryApi.getAll();
      console.log("Fetch categories - respuesta:", fetchedCategories);
      setCategories(Array.isArray(fetchedCategories) ? fetchedCategories : []);
      // una vez traídas las categorías, asignar category_id de forma segura:
      setFormData((prev) => {
        // si estamos editando un auto y su categoría existe en fetchedCategories, la usamos
        if (car && Array.isArray(fetchedCategories) && fetchedCategories.length > 0) {
          const has = fetchedCategories.some((c) => c.id === car.category?.id);
          return {
            ...prev,
            category_id: has ? car.category!.id : fetchedCategories[0].id,
          };
        }
        // si es creación, asignar la primera categoría si existe
        if (!car && Array.isArray(fetchedCategories) && fetchedCategories.length > 0) {
          return { ...prev, category_id: fetchedCategories[0].id };
        }
        // fallback (0) si no hay categorías
        return prev;
      });
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      setCategories([]);
      setCategoriesError(
        err?.message ? `Error: ${err.message}` : "Error desconocido al cargar categorías."
      );
    } finally {
      setLoadingCategories(false);
    }
  };

  // Al abrir el modal: revocar previews previas, cargar categorías y preparar formulario (si hay car)
  useEffect(() => {
    if (!isOpen) {
      // al cerrar: liberar objectURLs
      newImagePreviews.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {}
      });
      return;
    }

    // limpiar errores previos
    setCategoriesError(null);

    // siempre intentar cargar categorías al abrir
    fetchCategories();

    // inicializar form con el auto si existe
    if (car) {
      setFormData({
        name: car.name ?? "",
        description: car.description ?? "",
        carBrand: car.carBrand ?? "",
        pricePerHour: car.pricePerHour ?? 0,
        // category_id será ajustado en fetchCategories cuando lleguen las categorías
        category_id: car.category?.id ?? 0,
        images: [],
        characteristics: car.characteristics ?? [],
      });
      setCharacteristicsInput((car.characteristics || []).join(", "));

      // normalizar imágenes existentes
      const imgs = (car.images || []).map((img) => normalizeImage(img));
      setExistingImages(imgs);
      setNewImagePreviews([]);
    } else {
      // si no hay car, reset limpio (category_id se ajustará luego con categories)
      resetForm();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, car]);

  // efecto para limpiar object URLs cuando cambian newImagePreviews (evitar memory leak)
  useEffect(() => {
    return () => {
      newImagePreviews.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {}
      });
    };
  }, [newImagePreviews]);

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
    // liberar previews anteriores
    newImagePreviews.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {}
    });
    setNewImagePreviews([]);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const next =
      name === "pricePerHour" || name === "category_id" ? Number(value) : value;
    setFormData((prev) => ({
      ...prev,
      [name]: next,
    }) as unknown as NewCar);
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
    // liberar viejas previews
    newImagePreviews.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {}
    });

    if (!files || files.length === 0) {
      setFormData((prev) => ({ ...prev, images: [] }));
      setNewImagePreviews([]);
      return;
    }

    const fileArray = Array.from(files);
    const fileUrls = fileArray.map((file) => URL.createObjectURL(file));
    setNewImagePreviews(fileUrls);

    setFormData((prev) => ({
      ...prev,
      images: fileArray,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // validación mínima
    if (!formData.name) {
      alert("El nombre es obligatorio.");
      return;
    }
    if (!formData.category_id || formData.category_id === 0) {
      alert("Selecciona una categoría válida.");
      return;
    }

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
      alert("Hubo un error guardando el auto. Revisa la consola.");
    }
  };

  // Si el modal está cerrado, no renderizamos nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 flex items-center justify-center">
      <div className="bg-white rounded-md shadow-lg p-6 relative w-11/12 max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {car ? "Editar Auto" : "Crear Auto"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <input
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca
              </label>
              <input
                name="carBrand"
                value={formData.carBrand}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio por hora
              </label>
              <input
                name="pricePerHour"
                type="number"
                value={formData.pricePerHour}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>

              {loadingCategories ? (
                <p className="text-gray-500">Cargando categorías...</p>
              ) : categoriesError ? (
                <div>
                  <p className="text-red-500">Error cargando categorías.</p>
                  <p className="text-sm text-gray-600 mb-2">{categoriesError}</p>
                  <button
                    type="button"
                    onClick={() => fetchCategories()}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    Reintentar
                  </button>
                </div>
              ) : categories.length === 0 ? (
                <div>
                  <p className="text-red-500">No hay categorías disponibles.</p>
                  <button
                    type="button"
                    onClick={() => fetchCategories()}
                    className="mt-2 px-3 py-1 bg-gray-200 rounded"
                  >
                    Reintentar
                  </button>
                </div>
              ) : (
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Características */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Características (separadas por coma)
              </label>
              <input
                value={characteristicsInput}
                onChange={handleCharacteristicsChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Imágenes */}
            <div className="md:col-span-2 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imágenes
              </label>
              <input
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


