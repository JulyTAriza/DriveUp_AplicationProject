"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/SideBarUser";
import { useAuth } from "@/components/AuthContext";
import { userApi, User } from "@/state/api";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [formData, setFormData] = useState<User | null>(null);
  const [message, setMessage] = useState<string>("");

  // Cargar datos del usuario logueado
  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return;
      try {
        const u = await userApi.getById(user.id);
        setFormData(u);
      } catch (err) {
        console.error("Error cargando perfil:", err);
      }
    };
    fetchUser();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!formData) return;
    try {
      await userApi.update(formData);
      setMessage("Perfil actualizado correctamente ✅");
    } catch (err) {
      console.error("Error actualizando perfil:", err);
      setMessage("Error al actualizar perfil ❌");
    }
  };

  if (isLoading || !formData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>
        <p className="text-gray-600 mb-4">Aquí puedes gestionar tus datos personales.</p>

        <div className="mt-6 p-6 bg-white rounded-xl shadow max-w-md space-y-4">
          <div>
            <label className="block font-semibold">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold">Nueva Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Deja en blanco si no quieres cambiarla"
            />
          </div>

          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Guardar cambios
          </button>

          {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
        </div>
      </main>
    </div>
  );
}
