"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Search, Pencil, Trash2, Car, CalendarCheck, Users, LogOut } from "lucide-react";
import Image from "next/image";
import CreateCarModal from "./CreateProductModal";
import { carApi, Car as CarType } from "@/state/api";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";

/**
 * Componente que contiene toda la lógica y la tabla de gestión de productos.
 * Es la vista principal que se muestra en el dashboard de administrador.
 */
const ProductsContent = () => {
  const [cars, setCars] = useState<CarType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);

  // Cargar autos al inicio
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await carApi.getAll();
        setCars(data);
      } catch (err) {
        console.error("Error cargando autos:", err);
      }
    };
    fetchCars();
  }, []);

  // Crear o actualizar auto
  const handleCreated = (savedCar: CarType) => {
    if (selectedCar) {
      // Editar
      setCars((prev) =>
        prev.map((c) => (c.id === savedCar.id ? savedCar : c))
      );
    } else {
      // Crear
      setCars((prev) => [...prev, savedCar]);
    }
    setIsModalOpen(false);
    setSelectedCar(null);
  };

  // Eliminar auto
  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que quieres eliminar este auto?")) {
      try {
        await carApi.delete(id);
        setCars((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        console.error("Error eliminando auto:", err);
      }
    }
  };

  // Editar auto (abre modal con datos)
  const handleEdit = (car: CarType) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  // ✅ Búsqueda mejorada: filtra por nombre y marca
  const filteredCars = cars.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.carBrand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto pb-5 w-full">
      {/* SEARCH */}
      <div className="mb-6 flex items-center border-2 border-gray-200 rounded">
        <Search className="w-5 h-5 text-gray-500 m-2" />
        <input
          className="w-full py-2 px-4 rounded bg-white"
          placeholder="Buscar autos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Autos</h1>
        <button
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-gray-200 font-bold py-2 px-4 rounded"
          onClick={() => {
            setSelectedCar(null);
            setIsModalOpen(true);
          }}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Crear Auto
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="py-3 px-4 text-left">Foto</th>
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-left">Marca</th>
              <th className="py-3 px-4 text-left">Precio/Hora</th>
              <th className="py-3 px-4 text-center">Operación</th>
            </tr>
          </thead>
          <tbody>
            {filteredCars.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No encontramos autos
                </td>
              </tr>
            ) : (
              filteredCars.map((car) => (
                <tr key={car.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <Image
                      src={
                        car.imagePaths && car.imagePaths.length > 0
                          ? car.imagePaths[0]
                          : "/cars/default.jpg"
                      }
                      alt={car.name}
                      width={60}
                      height={60}
                      className="rounded object-cover"
                    />
                  </td>
                  <td className="py-3 px-4">{car.name}</td>
                  <td className="py-3 px-4">{car.carBrand}</td>
                  <td className="py-3 px-4">${car.pricePerHour.toFixed(2)}</td>
                  <td className="py-3 px-4 flex justify-center gap-3">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => handleEdit(car)}
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(car.id)}
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

      <CreateCarModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCar(null);
        }}
        onCreated={handleCreated}
        car={selectedCar}
      />
    </div>
  );
};

/**
 * Componente principal del Dashboard de Administración.
 * Contiene la barra lateral y renderiza el contenido principal.
 */
export default function AdminDashboardPage() {
  const { logout } = useAuth();
  const router = useRouter();
  const [activeView, setActiveView] = useState("products");

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const renderContent = () => {
    switch (activeView) {
      case "products":
        return <ProductsContent />;
      case "reservations":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Gestión de Reservas</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">
                Aquí podrás ver un listado de todas las reservas.
              </p>
            </div>
          </div>
        );
      case "users":
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6">Gestión de Usuarios</h2>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">
                Aquí podrás ver y gestionar las cuentas de los usuarios.
              </p>
            </div>
          </div>
        );
      default:
        return <ProductsContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar de navegación */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Panel Admin</h1>
        </div>
        <nav className="flex-1 px-4">
          <ul>
            <li className="mb-2">
              <button
                onClick={() => setActiveView("products")}
                className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                  activeView === "products"
                    ? "bg-gray-700 font-semibold text-white"
                    : "hover:bg-gray-700"
                }`}
              >
                <Car className="mr-3" size={20} />
                Gestión de Autos
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveView("reservations")}
                className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                  activeView === "reservations"
                    ? "bg-gray-700 font-semibold text-white"
                    : "hover:bg-gray-700"
                }`}
              >
                <CalendarCheck className="mr-3" size={20} />
                Gestión de Reservas
              </button>
            </li>
            <li className="mb-2">
              <button
                onClick={() => setActiveView("users")}
                className={`w-full text-left flex items-center p-3 rounded-lg transition-colors ${
                  activeView === "users"
                    ? "bg-gray-700 font-semibold text-white"
                    : "hover:bg-gray-700"
                }`}
              >
                <Users className="mr-3" size={20} />
                Gestión de Usuarios
              </button>
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

      {/* Contenido principal */}
      <main className="flex-1 overflow-y-auto p-8">
        {renderContent()}
      </main>
    </div>
  );
}