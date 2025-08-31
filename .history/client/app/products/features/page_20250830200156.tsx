"use client";

import { PlusCircle, Search, Pencil, Trash2 } from "lucide-react";
import UserSidebar from "@/components/SideBar";


export default function FeaturesPage() {
  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH */}
      <div className="mb-6 flex items-center border-2 border-gray-200 rounded">
        <Search className="w-5 h-5 text-gray-500 m-2" />
        <input
          className="w-full py-2 px-4 rounded bg-white"
          placeholder="Buscar características..."
          readOnly
        />
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Características</h1>
        <button className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded">
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
            <tr>
              <td className="py-3 px-4">Característica 1</td>
              <td className="py-3 px-4">
                <span className="flex items-center gap-2">
                  <i className="icon-clase"></i>
                  <span className="text-gray-700">icon-clase</span>
                </span>
              </td>
              <td className="py-3 px-4 flex justify-center gap-3">
                <button className="text-blue-500 hover:text-blue-700">
                  <Pencil className="w-5 h-5" />
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
            <tr>
              <td className="py-3 px-4">Característica 2</td>
              <td className="py-3 px-4 text-gray-400">Sin icono</td>
              <td className="py-3 px-4 flex justify-center gap-3">
                <button className="text-blue-500 hover:text-blue-700">
                  <Pencil className="w-5 h-5" />
                </button>
                <button className="text-red-500 hover:text-red-700">
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* MODAL SIMULADO */}
      <div className="hidden">
        {/* Aquí estaría el modal de creación/edición, solo de referencia */}
      </div>
    </div>
  );
}
