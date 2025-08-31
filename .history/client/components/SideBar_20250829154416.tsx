"use client";

import { useAuth } from "@/components/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { CalendarCheck, Car, LogOut, Users } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Panel Admin</h1>
      </div>
      <nav className="flex-1 px-4">
        <ul>
          <li className="mb-2">
            <Link
              href="/products"
              className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                pathname === "/products" ? "bg-gray-700 font-semibold text-white" : "hover:bg-gray-700"
              }`}
            >
              <Car className="mr-3" size={20} />
              Gestión de Autos
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href="/products/reservations"
              className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                pathname === "/products/reservations" ? "bg-gray-700 font-semibold text-white" : "hover:bg-gray-700"
              }`}
            >
              <CalendarCheck className="mr-3" size={20} />
              Gestión de Reservas
            </Link>
          </li>
          <li className="mb-2">
            <Link
              href="/products/users"
              className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                pathname === "/products/users" ? "bg-gray-700 font-semibold text-white" : "hover:bg-gray-700"
              }`}
            >
              <Users className="mr-3" size={20} />
              Gestión de Usuarios
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center p-3 rounded-lg text-red-400 hover:bg-gray-700 transition-colors"
        >
          <LogOut className="mr-3" size={20} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}