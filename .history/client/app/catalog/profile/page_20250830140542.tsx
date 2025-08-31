"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/SideBarUser";
import { useAuth } from "@/components/AuthContext";
import { userApi, User } from "@/state/api";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [formData, setFormData] = useState<User | null>(null);

  // 🔹 Cargar datos del usuario logueado
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
        <p className="text-gray-600 mb-4">
          Aquí puedes consultar tus datos personales. (Solo lectura)
        </p>

        <div className="mt-6 p-6 bg-white rounded-xl shadow max-w-md space-y-4">
          <p>
            <span className="font-semibold">Nombre:</span> {formData.nombre}
          </p>
          <p>
            <span className="font-semibold">Apellido:</span> {formData.apellido}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {formData.email}
          </p>
          <p>
            <span className="font-semibold">Rol:</span> {formData.role}
          </p>
        </div>
      </main>
    </div>
  );
}
