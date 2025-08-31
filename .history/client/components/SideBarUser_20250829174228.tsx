"use client";

import { useAuth } from "@/components/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { Car, Heart, User, HelpCircle, LogOut, Home } from "lucide-react";
import Link from "next/link";

export default function UserSidebar() {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const links = [
    { href: "/catalog", label: "Explorar Autos", icon: Home },
    { href: "/catalog/reservations", label: "Mis Reservas", icon: Car },
    { href: "/catalog/favorites", label: "Favoritos", icon: Heart },
    { href: "/catalog/profile", label: "Mi Perfil", icon: User },
    { href: "/catalog/support", label: "Soporte", icon: HelpCircle },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">Mi Cuenta</h1>
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
