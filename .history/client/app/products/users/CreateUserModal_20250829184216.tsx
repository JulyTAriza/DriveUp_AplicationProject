"use client";

import { useState, useEffect } from "react";
import { userApi, User } from "@/state/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (user: User) => void;
  user: User | null;
}

export default function CreateUserModal({ isOpen, onClose, onCreated, user }: Props) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "USER">("USER");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      setNombre(user.nombre);
      setApellido(user.apellido);
      setEmail(user.email);
      setRole(user.role as "ADMIN" | "USER");
      setPassword(""); // no se muestra contraseña en edición
    } else {
      setNombre("");
      setApellido("");
      setEmail("");
      setRole("USER");
      setPassword("");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let savedUser: User;
      if (user) {
        // actualizar
        savedUser = await userApi.update({
          ...user,
          nombre,
          apellido,
          email,
          role,
          password: password || user.password, // si no se cambia, dejar igual
        });
      } else {
        // crear
        savedUser = await userApi.create({
          nombre,
          apellido,
          email,
          role,
          password,
        } as User);
      }
      onCreated(savedUser);
    } catch (err) {
      console.error("Error guardando usuario:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">
          {user ? "Editar Usuario" : "Crear Usuario"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
          <input
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "ADMIN" | "USER")}
            className="w-full border rounded p-2"
          >
            <option value="USER">Usuario</option>
            <option value="ADMIN">Administrador</option>
          </select>
          {!user && (
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-700"
            >
              {user ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
