"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Search, Pencil, Trash2 } from "lucide-react";
import { featureApi, Feature } from "@/state/api"; // <-- debes definirlo en api.ts
import CreateFeatureModal from "./CreateFeatureModal"; // modal similar a CreateCategoryModal

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  // cargar características al inicio
  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const data = await featureApi.getAll();
        setFeatures(data);
      } catch (err) {
        console.error("Error cargando características:", err);
      }
    };
    fetchFeatures();
  }, []);

  // crear o actualizar característica
  const handleCreated = (savedFeature: Feature) => {
    if (selectedFeature) {
      // editar
      setFeatures((prev) =>
        prev.map((f) => (f.id === savedFeature.id ? savedFeature : f))
      );
    } else {
      // crear
      setFeatures((prev) => [...prev, savedFeature]);
    }
    setIsModalOpen(false);
    setSelectedFeature(null);
  };

  // eliminar característica
  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que quieres eliminar esta característica?")) {
      try {
        await featureApi.delete(id);
        setFeatures((prev) => prev.filter((f) => f.id !== id));
      } catch (err) {
        console.error("Error eliminando característica:", err);
      }
    }
  };

  // editar característica
  const handleEdit = (feature: Feature) => {
    setSelectedFeature(feature);
    setIsModalOpen(true);
  };

  // filtrar características
  const filteredFeatures = features.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH */}
      <div className="mb-6 flex items-center border-2 border-gray-200 rounded">
        <Search className="w-5 h-5 text-gray-500 m-2" />
        <input
          className="w-full py-2 px-4 rounded bg-white"
          placeholder="Buscar características..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Características</h1>
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => {
            setSelectedFeature(null);
            setIsModalOpen(true);
          }}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Crear Característica
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-left">Ícono</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeatures.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-4 text-gray-500">
                  No encontramos características
                </td>
              </tr>
            ) : (
              filteredFeatures.map((f) => (
                <tr key={f.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{f.name}</td>
                  <td className="py-3 px-4">
                    {f.icon ? (
                      <span className="flex items-center gap-2">
                        <i className={f.icon}></i> {/* si usas clases de íconos */}
                        <span className="text-gray-700">{f.icon}</span>
                      </span>
                    ) : (
                      <span className="text-gray-400">Sin icono</span>
                    )}
                  </td>
                  <td className="py-3 px-4 flex justify-center gap-3">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleEdit(f)}
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(f.id)}
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
      <CreateFeatureModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedFeature(null);
        }}
        onCreated={handleCreated}
        feature={selectedFeature}
      />
    </div>
  );
}
