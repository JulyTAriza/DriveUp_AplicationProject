"use client";

import { useEffect, useState } from "react";
import { categoryApi, Category } from "@/state/api";

interface Props {
  onSelectCategory: (categoryId: number) => void; // callback para filtrar autos
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="p-4 bg-white shadow-md rounded-xl hover:shadow-lg transition text-center"
          >
            <p className="font-semibold">{cat.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
