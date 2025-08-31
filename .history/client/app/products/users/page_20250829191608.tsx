"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Search, Pencil, Trash2 } from "lucide-react";
import { userApi, User } from "@/state/api"; 
import CreateUserModal from "./CreateUserModal";
import SidebarUser from "@/components/SideBar";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // cargar usuarios al inicio
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userApi.getAll();
        setUsers(data);
      } catch (err) {
        console.error("Error cargando usuarios:", err);
      }
    };
    fetchUsers();
  }, []);

  // crear o actualizar usuario
  const handleCreated = (savedUser: User) => {
    if (selectedUser) {
      // editar
      setUsers((prev) =>
        prev.map((u) => (u.id === savedUser.id ? savedUser : u))
      );
    } else {
      // crear
      setUsers((prev) => [...prev, savedUser]);
    }
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // eliminar usuario
  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que quieres eliminar este usuario?")) {
      try {
        await userApi.delete(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } catch (err) {
        console.error("Error eliminando usuario:", err);
      }
    }
  };

  // editar usuario (abre modal con datos)
  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // filtrar usuarios (nombre + apellido + email)
  const filteredUsers = users.filter((u) =>
    `${u.nombre} ${u.apellido} ${u.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      {/* Sidebar */}
      <SidebarUser />

      {/* Content */}
      <div className="flex-1 p-6">
        {/* SEARCH */}
        <div className="mb-6 flex items-center border-2 border-gray-200 rounded">
          <Search className="w-5 h-5 text-gray-500 m-2" />
          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
          <button
            className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Crear Usuario
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="py-3 px-4 text-left">Nombre</th>
                <th className="py-3 px-4 text-left">Apellido</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Rol</th>
                <th className="py-3 px-4 text-center">Operación</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No encontramos usuarios
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{user.nombre}</td>
                    <td className="py-3 px-4">{user.apellido}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.role}</td>
                    <td className="py-3 px-4 flex justify-center gap-3">
                      <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => handleEdit(user)}
                      >
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(user.id)}
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

        {/* MODAL CREAR/EDITAR */}
        <CreateUserModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
          onCreated={handleCreated}
          user={selectedUser}
        />
      </div>
    </div>
  );
}
