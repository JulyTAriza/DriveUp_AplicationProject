"use client";

import { useState } from "react";
import { categoryApi, Category } from "@/state/api";

interface Props {
  onCategoryCreated: (category: Category) => void;
}

export default function CreateCategoryModal({ onCategoryCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const newCategory = await categoryApi.create({ name, cars_id: [] });
      onCategoryCreated(newCategory);
      setName("");
      setOpen(false);
    } catch (err) {
      setError("❌ Error al crear la categoría");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Botón para abrir modal */}
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + Crear Categoría
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Crear nueva categoría</h2>

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
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
