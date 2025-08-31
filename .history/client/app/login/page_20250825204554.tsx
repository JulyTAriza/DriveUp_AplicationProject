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
    <div 
      className="flex justify-center items-center h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/iniciodesesion.jpg')" }} 
    >
      {/* capa oscura para mejorar contraste */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* formulario login */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/90 backdrop-blur-md p-8 shadow-2xl rounded-2xl w-96"
      >
        {/* logo */}
        <div className="flex justify-center mb-1">
           <img
            src="/logo.png"
            alt="Logo"
            className="w-60 h-60 md:w-80 md:h-20 object-contain"
        />
        </div>

        <h2 className="text-2xl font-bold text-center mb-1 text-gray-800">
          Iniciar Sesión
        </h2>

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 p-3 w-full mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          type="submit"
          className="bg-black text-white py-3 rounded-lg w-full font-semibold shadow-md hover:bg-gray-800 transition duration-300"
        >
          Ingresar
        </button>

        <p className="text-sm text-center mt-6 text-gray-700">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="text-black font-semibold hover:underline">
            Crear cuenta
          </Link>
        </p>
      </form>
    </div>
  );
}
