"use client";

import { useAuth } from "@/components/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import {
  CalendarCheck,
  Car,
  LogOut,
  Users,
  Tag,
  Star,
  BarChart2,
} from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const links = [
    { href: "/products", label: "Gestión de Autos", icon: Car },
    { href: "/products/reservations", label: "Gestión de Reservas", icon: CalendarCheck },
    { href: "/products/users", label: "Gestión de Usuarios", icon: Users },
    { href: "/products/categories", label: "Gestión de Categorías", icon: Tag },
    { href: "/products/features", label: "Gestión de Características", icon: Star },
    { href: "/products/reports", label: "Reportes", icon: BarChart2 },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Panel Admin</h1>
      </div>
      <nav className="flex-1 px-4">
        <ul>
          {links.map(({ href, label, icon: Icon }) => (
            <li key={href} className="mb-2">
              <Link
                href={href}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  pathname === href
                    ? "bg-gray-700 font-semibold text-white"
                    : "hover:bg-gray-700"
                }`}
              >
                <Icon className="mr-3" size={20} />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center p-3 rounded-lg text-red-400 hover:bg-gray-700 transition-colors"
        >
          <LogOut className="mr-3" size={20} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
