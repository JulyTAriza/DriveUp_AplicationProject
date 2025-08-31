"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";
import { Heart, Home, LogOut, Car } from "lucide-react";

// ✅ Simulación de tipos y datos para el dashboard (reemplaza esto con tu API real)
interface Reservation {
  id: number;
  carName: string;
  carBrand: string;
  startDate: string;
  endDate: string;
  imagePath: string;
}

interface FavoriteCar {
  id: number;
  name: string;
  brand: string;
  imagePath: string;
  pricePerHour: number;
}

const mockReservations: Reservation[] = [
  {
    id: 1,
    carName: "Mustang GT",
    carBrand: "Ford",
    startDate: "2023-10-27",
    endDate: "2023-10-30",
    imagePath: "https://images.unsplash.com/photo-1549480017-d711c1822709?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    carName: "Model S",
    carBrand: "Tesla",
    startDate: "2023-11-15",
    endDate: "2023-11-18",
    imagePath: "https://images.unsplash.com/photo-1627255160677-24a640106263?q=80&w=2070&auto=format&fit=crop",
  },
];

const mockFavorites: FavoriteCar[] = [
  {
    id: 3,
    name: "Aventador",
    brand: "Lamborghini",
    imagePath: "https://images.unsplash.com/photo-1571241940954-46b5d2df807e?q=80&w=2070&auto=format&fit=crop",
    pricePerHour: 150,
  },
  {
    id: 4,
    name: "R8",
    brand: "Audi",
    imagePath: "https://images.unsplash.com/photo-1606551121175-1e3d778d9b1c?q=80&w=2070&auto=format&fit=crop",
    pricePerHour: 90,
  },
];

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [activeView, setActiveView] = useState<"reservations" | "favorites">("reservations");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [favorites, setFavorites] = useState<FavoriteCar[]>([]);

  // ✅ Redirige al login si no hay usuario o si los datos aún no han cargado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  // ✅ Lógica para cargar las reservas y favoritos (simulado)
  useEffect(() => {
    if (user) {
      // Aquí harías la llamada a tu API para obtener los datos del usuario
      // Ejemplo: const userReservations = await api.getReservations(user.id);
      setReservations(mockReservations);
      // Ejemplo: const userFavorites = await api.getFavorites(user.id);
      setFavorites(mockFavorites);
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Cargando...</div>
      </div>
    );
  }

  const renderContent = () => {
    if (activeView === "reservations") {
      return (
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6">Mis reservas</h2>
          {reservations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reservations.map((res) => (
                <div key={res.id} className="bg-white rounded-xl shadow-lg p-6">
                  <Image src={res.imagePath} alt={res.carName} width={400} height={200} className="rounded-md object-cover w-full h-40 mb-4" />
                  <h3 className="text-xl font-semibold">{res.carBrand} {res.carName}</h3>
                  <p className="text-sm text-gray-500 mt-2">
                    **Fechas:** {res.startDate} a {res.endDate}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tienes reservas activas.</p>
          )}
        </div>
      );
    } else { // activeView === "favorites"
      return (
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6">Mis Favoritos</h2>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((fav) => (
                <div key={fav.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <Image src={fav.imagePath} alt={fav.name} width={400} height={200} className="object-cover w-full h-48" />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{fav.brand} {fav.name}</h3>
                    <p className="text-sm text-gray-500">${fav.pricePerHour} / hora</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aún no has guardado ningún auto como favorito.</p>
          )}
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col p-6">
        <div className="flex items-center gap-4 mb-8">
          <Image src="/logo.png" alt="Logo" width={50} height={50} className="rounded-full" />
          <div>
            <h2 className="text-xl font-bold">¡Hola, {user.email}!</h2>
            <p className="text-sm text-gray-400 capitalize">{user.rol}</p>
          </div>
        </div>
        <nav className="flex-1">
          <ul>
            <li className="mb-4">
              <button 
                onClick={() => setActiveView("reservations")}
                className={`flex items-center gap-3 p-3 w-full rounded-lg transition-colors ${activeView === "reservations" ? "bg-gray-700 font-semibold" : "hover:bg-gray-700"}`}
              >
                <Car size={20} /> Mis reservas
              </button>
            </li>
            <li className="mb-4">
              <button 
                onClick={() => setActiveView("favorites")}
                className={`flex items-center gap-3 p-3 w-full rounded-lg transition-colors ${activeView === "favorites" ? "bg-gray-700 font-semibold" : "hover:bg-gray-700"}`}
              >
                <Heart size={20} /> Favoritos
              </button>
            </li>
          </ul>
        </nav>
        <button onClick={logout} className="flex items-center gap-3 p-3 text-red-400 hover:bg-gray-700 rounded-lg transition-colors">
          <LogOut size={20} /> Cerrar Sesión
        </button>
      </div>
      
      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}