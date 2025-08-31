"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const NavBar = () => {
  // simula estado de login (después lo conectarás con auth real)
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="w-full fixed top-0 z-50 bg-white shadow-md">
      <nav className="max-w-[1440px] mx-auto flex justify-between items-center sm:px-16 px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex justify-center items-center">
          <Image
            src="/logo.png" // cambia tu logo aquí
            alt="logo"
            width={190}
            height={180}
            className="object-contain"
          />
          <span className="ml-2 font-bold text-lg text-primary-blue"></span>
        </Link>

        {/* Links de navegación */}
        <div className="flex gap-6 items-center">
          <Link href="/" className="hover:text-primary-blue font-medium">
            Home
          </Link>
          <Link href="/catalogo" className="hover:text-primary-blue font-medium">
            Catálogo
          </Link>

          {isLoggedIn ? (
            <>
              <Link href="/perfil" className="hover:text-primary-blue font-medium">
                Perfil
              </Link>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="px-4 py-2 bg-primary-blue text-white rounded-full hover:bg-blue-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 bg-primary-blue text-white rounded-full hover:bg-blue-700"
            >
              Ingresar
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
