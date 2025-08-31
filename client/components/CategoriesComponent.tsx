"use client";

import { useEffect, useState } from "react";
import { categoryApi, Category } from "@/state/api";

interface Props {
  onSelectCategory: (categoryId?: number) => void; // opcional para "Todas"
}

export default function CategoriesComponent({ onSelectCategory }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAll();
        setCategories(data);
      } catch (err) {
        console.error("Error cargando categorías:", err);
        setError("⚠️ No se pudieron cargar las categorías");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <p className="text-gray-600">Cargando categorías...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Categorías</h2>

      <div className="flex flex-wrap gap-3">
        {/* Botón Todas */}
        <button
          onClick={() => onSelectCategory(undefined)}
          className="px-4 py-2 bg-black text-white rounded-full hover:opacity-90"
        >
          Todas
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="px-4 py-2 bg-white border rounded-full shadow-sm hover:bg-gray-100 transition"
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}

