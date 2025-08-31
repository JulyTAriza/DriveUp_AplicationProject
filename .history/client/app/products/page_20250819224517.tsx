"use client";

import { useState } from "react";
import { PlusCircle, Search, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import CreateProductoModal from "./CreateProductModal";

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen: string;
}

const mockProductos: Producto[] = [
  {
    id: 1,
    nombre: "Toyota Corolla",
    descripcion: "Sedán confiable y eficiente",
    precio: 25000,
    stock: 10,
    imagen: "/cars/corolla.jpg",
  },
  {
    id: 2,
    nombre: "Ford Mustang",
    descripcion: "Deportivo clásico",
    precio: 45000,
    stock: 5,
    imagen: "/cars/mustang.jpg",
  },
];

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>(mockProductos);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);

  const handleCreateProducto = (data: Omit<Producto, "id">) => {
    if (selectedProducto) {
      // editar
      setProductos((prev) =>
        prev.map((p) =>
          p.id === selectedProducto.id ? { ...selectedProducto, ...data } : p
        )
      );
    } else {
      // crear
      const newProducto: Producto = {
        id: productos.length + 1,
        ...data,
      };
      setProductos((prev) => [...prev, newProducto]);
    }
    setIsModalOpen(false);
    setSelectedProducto(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("¿Seguro que quieres eliminar este producto?")) {
      setProductos((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleEdit = (producto: Producto) => {
    setSelectedProducto(producto);
    setIsModalOpen(true);
  };

  const filteredProductos = productos.filter((p) =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH */}
      <div className="mb-6 flex items-center border-2 border-gray-200 rounded">
        <Search className="w-5 h-5 text-gray-500 m-2" />
        <input
          className="w-full py-2 px-4 rounded bg-white"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => {
            setSelectedProducto(null);
            setIsModalOpen(true);
          }}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Crear Producto
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-4 text-left">Foto</th>
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-left">Precio</th>
              <th className="py-3 px-4 text-left">Stock</th>
              <th className="py-3 px-4 text-center">Operación</th>
            </tr>
          </thead>
          <tbody>
            {filteredProductos.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No encontramos productos
                </td>
              </tr>
            ) : (
              filteredProductos.map((producto) => (
                <tr key={producto.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <Image
                      src={producto.imagen}
                      alt={producto.nombre}
                      width={60}
                      height={60}
                      className="rounded"
                    />
                  </td>
                  <td className="py-3 px-4">{producto.nombre}</td>
                  <td className="py-3 px-4">${producto.precio.toFixed(2)}</td>
                  <td className="py-3 px-4">{producto.stock}</td>
                  <td className="py-3 px-4 flex justify-center gap-3">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleEdit(producto)}
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(producto.id)}
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
      <CreateProductoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProducto(null);
        }}
        onCreate={handleCreateProducto}
        producto={selectedProducto}
      />
    </div>
  );
}
