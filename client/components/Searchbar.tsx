"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Searchbar = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (search.trim() === "") {
      return alert("Por favor, introduce un fabricante o modelo");
    }

    // Crear los parámetros de búsqueda
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("q", search.toLowerCase());

    // ✅ Uso correcto de template string
    const newPathname = `${window.location.pathname}?${searchParams.toString()}`;

    // Redirigir con el nuevo pathname
    router.push(newPathname);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-lg relative">
      <Image
        src="/magnifying-glass.svg"
        width={20}
        height={20}
        alt="Buscar"
        className="absolute left-4 top-1/2 -translate-y-1/2 opacity-60"
      />
      <input
        type="text"
        name="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar autos..."
        className="w-full p-3 pl-12 rounded-full bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </form>
  );
};

export default Searchbar;
