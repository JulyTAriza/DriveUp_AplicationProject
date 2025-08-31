"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Search, Pencil, Trash2 } from "lucide-react";
import { categoryApi, Category } from "@/state/api";
import CreateCategoryModal from "./CreateCategoryModal";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // cargar categorías al inicio
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getAll();
        setCategories(data);
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    };
    fetchCategories();
  }, []);

  // crear o actualizar categoría
  const handleCreated = (savedCategory: Category) => {
    if (selectedCategory) {
      // editar
      setCategories((prev) =>
        prev.map((c) => (c.id === savedCategory.id ? savedCategory : c))
      );
    } else {
      // crear
      setCategories((prev) => [...prev, savedCategory]);
    }
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  // eliminar categoría
  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que quieres eliminar esta categoría?")) {
      try {
        await categoryApi.delete(id);
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        console.error("Error eliminando categoría:", err);
      }
    }
  };

  // editar categoría
  const handleEdit = (cat: Category) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };

  // filtrar categorías (con name real)
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH */}
      <div className="mb-6 flex items-center border-2 border-gray-200 rounded">
        <Search className="w-5 h-5 text-gray-500 m-2" />
        <input
          className="w-full py-2 px-4 rounded bg-white"
          placeholder="Buscar categorías..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Categorías</h1>
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => {
            setSelectedCategory(null);
            setIsModalOpen(true);
          }}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Crear Categoría
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-left">Autos asociados</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  No encontramos categorías
                </td>
              </tr>
            ) : (
              filteredCategories.map((cat) => (
                <tr key={cat.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{cat.name}</td>
                  <td className="py-3 px-4">{cat.cars_id?.length || 0}</td>
                  <td className="py-3 px-4 flex justify-center gap-3">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleEdit(cat)}
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(cat.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL CREAR/EDITAR */}
      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        onCreated={handleCreated}
        category={selectedCategory}
      />
    </div>
  );
}
