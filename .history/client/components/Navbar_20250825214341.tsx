"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="w-full fixed top-0 z-50 bg-white shadow-md">
      <nav
        className="
          max-w-[1440px] 
          mx-auto 
          flex justify-between items-center
          sm:px-16 px-6
          h-20
        "
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="logo"
            width={160}
            height={160}
            className="object-contain max-h-[50px]"
          />
          <span className="text-lg font-bold tracking-wide text-[#001402]">
          </span>
        </Link>

        {/* Links de navegación */}
        <div className="flex gap-6 items-center text-sm font-medium">
          <Link
            href="/"
            className="hover:text-[#013d0b] text-gray-700 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            href="/catalog"
            className="hover:text-[#013d0b] text-gray-700 transition-colors duration-200"
          >
            Catálogo
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href="/perfil"
                className="hover:text-[#013d0b] text-gray-700 transition-colors duration-200"
              >
                Perfil
              </Link>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="px-5 py-2 rounded-full bg-[#001402] text-white font-semibold hover:bg-[#013d0b] transition-colors duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-5 py-2 rounded-full bg-[#001402] text-white font-semibold hover:bg-[#013d0b] transition-colors duration-200"
              >
                Ingresar
              </Link>
              
              <Link
                href="/register"
                className="px-5 py-2 rounded-full border border-[#001402] text-[#001402] font-semibold hover:bg-[#001402] hover:text-white transition-colors duration-200"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
