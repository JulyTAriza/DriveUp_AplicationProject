// components/Pagination.tsx
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null; // No mostrar si solo hay 1 página

  return (
    <div className="flex justify-center items-center mt-6 space-x-2">
      {/* Botón Anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Anterior
      </button>

      {/* Números de página */}
      {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 border rounded ${
            page === currentPage
              ? "bg-black text-white font-bold"
              : "hover:bg-gray-200"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Botón Siguiente */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
}