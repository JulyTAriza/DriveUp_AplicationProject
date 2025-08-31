"use client";

import { useState } from "react";
import { useAuth } from "../../components/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<string[]>([]);

  const validateForm = () => {
    const newErrors: string[] = [];

    // Nombre y apellido obligatorios
    if (!nombre.trim()) newErrors.push("El nombre es obligatorio");
    if (!apellido.trim()) newErrors.push("El apellido es obligatorio");

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) newErrors.push("El correo es obligatorio");
    else if (!emailRegex.test(email)) newErrors.push("El correo no es válido");

    // Contraseña obligatoria y segura
    if (!password) newErrors.push("La contraseña es obligatoria");
    else if (password.length < 8)
      newErrors.push("La contraseña debe tener al menos 8 caracteres");
    else if (!/[A-Z]/.test(password))
      newErrors.push("La contraseña debe tener al menos una mayúscula");
    else if (!/[a-z]/.test(password))
      newErrors.push("La contraseña debe tener al menos una minúscula");
    else if (!/[0-9]/.test(password))
      newErrors.push("La contraseña debe tener al menos un número");
    else if (!/[^A-Za-z0-9]/.test(password))
      newErrors.push("La contraseña debe tener al menos un símbolo");

    // Confirmación de contraseña
    if (password !== confirmPassword)
      newErrors.push("Las contraseñas no coinciden");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const success = await register(nombre, apellido, email, password);
    if (success) {
      alert("Registro exitoso, ahora puedes usar tu cuenta");
      router.push("/catalog");
    } else {
      alert("Error en el registro");
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/registro.jpg')" }}
    >
      {/* Capa oscura */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Caja blanca encima */}
      <div className="relative z-10 bg-white p-8 rounded-2xl shadow-lg w-96">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="logo" width={180} height={180} />
        </div>

        <h2 className="text-center text-xl font-bold mb-6">Crear Cuenta</h2>

        {/* Mostrar errores */}
        {errors.length > 0 && (
          <div className="mb-4 text-red-600 text-sm">
            <ul className="list-disc pl-5">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full mb-3 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="text"
            placeholder="Apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="w-full mb-3 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-3 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full mb-5 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition"
          >
            Crear Cuenta
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-black font-semibold hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
}
