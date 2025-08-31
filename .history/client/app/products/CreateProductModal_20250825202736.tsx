"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Producto } from "./page";

type CreateProductoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: Omit<Producto, "id">) => void;
  producto: Producto | null;
};

export default function CreateProductoModal({
  isOpen,
  onClose,
  onCreate,
  producto,
}: CreateProductoModalProps) {
  const [formData, setFormData] = useState<Omit<Producto, "id">>({
    nombre: "",
    descripcion: "",
    precio: 0,
    stock: 0,
    imagen: "/cars/default.jpg",
  });

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        imagen: producto.imagen,
      });
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        precio: 0,
        stock: 0,
        imagen: "/cars/default.jpg",
      });
    }
  }, [producto]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "precio" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.descripcion.trim()) {
      alert("Completa todos los campos");
      return;
    }
    onCreate(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 flex items-center justify-center">
      <div className="bg-white rounded-md shadow-lg w-96 p-6 relative">
        <h2 className="text-xl font-bold mb-4">
          {producto ? "Editar Producto" : "Crear Producto"}
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm mb-1">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
            required
          />
          <label className="block text-sm mb-1">Descripción</label>
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
            required
          />
          <label className="block text-sm mb-1">Precio</label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
            required
          />
          <label className="block text-sm mb-1">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
            required
          />
          <label className="block text-sm mb-1">Imagen (URL)</label>
          <input
            type="text"
            name="imagen"
            value={formData.imagen}
            onChange={handleChange}
            className="w-full p-2 border rounded mb-3"
          />

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 bg-gray-500 text-white rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              {producto ? "Guardar cambios" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
