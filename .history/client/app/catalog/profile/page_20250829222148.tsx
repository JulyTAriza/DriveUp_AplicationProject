"use client";

import Sidebar from "@/components/SideBarUser";

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>
        <p className="text-gray-600">Aquí puedes gestionar tus datos personales.</p>

        {/* 🔽 Info de usuario */}
        <div className="mt-6 p-6 bg-white rounded-xl shadow max-w-md">
          <p><span className="font-semibold">Nombre:</span> Juan Pérez</p>
          <p><span className="font-semibold">Email:</span> juanperez@mail.com</p>

          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Editar Perfil
          </button>
        </div>
      </main>
    </div>
  );
}
