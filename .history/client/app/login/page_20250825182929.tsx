"use client";
import { useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth(); 
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);

    if (success) {
      // ✅ Leer el usuario directamente del localStorage
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");

      if (savedUser?.rol === "ADMIN") {
        router.push("/products");
      } else {
        router.push("/catalog");
      }
    } else {
      alert("Credenciales inválidas");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-lg rounded-xl w-80"
      >
        <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          Ingresar
        </button>

        <p className="text-sm text-center mt-4">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-blue-600 underline">
            Crear cuenta
          </Link>
        </p>
      </form>
    </div>
  );
}
