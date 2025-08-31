"use client";

import { useState, useEffect } from "react";
import { categoryApi, Category } from "@/state/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (category: Category) => void;
  category: Category | null; // null = crear, objeto = editar
}

export default function CreateCategoryModal({
  isOpen,
  onClose,
  onCreated,
  category,
}: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // cargar datos al editar
  useEffect(() => {
    if (category) {
      setName(category.name);
    } else {
      setName("");
    }
  }, [category]);

  if (!isOpen) return null; // si no está abierto, no renderizar nada

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let saved: Category;
      if (category) {
        // editar
        saved = await categoryApi.update({ ...category, name });
      } else {
        // crear
        saved = await categoryApi.create({ name, cars_id: [] });
      }
      onCreated(saved);
      onClose();
    } catch (err) {
      setError("❌ Error al guardar la categoría");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">
          {category ? "Editar Categoría" : "Crear Categoría"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre de la categoría"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Guardando..." : category ? "Guardar cambios" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
