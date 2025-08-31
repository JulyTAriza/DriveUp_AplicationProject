"use client";

import Sidebar from "@/components/SideBarUser";

export default function FavoritesPage() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Mis Favoritos</h1>
        <p className="text-gray-600">
          Aquí podrás ver todos los autos que has guardado como favoritos.
        </p>

        {/* 🔽 Lista de autos favoritos */}
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Placeholder */}
          <div className="p-4 bg-white rounded-xl shadow">
            <img
              src="https://via.placeholder.com/400x200"
              alt="Auto"
              className="rounded-lg mb-2"
            />
            <h2 className="font-semibold">Toyota Corolla</h2>
            <button className="mt-2 text-sm text-red-500 hover:underline">
              Quitar de favoritos
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
