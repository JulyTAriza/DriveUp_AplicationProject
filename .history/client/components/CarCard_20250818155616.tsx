"use client";

import Image from "next/image";

type Car = {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string; // ruta a /public/cars
};

export default function CarCard({ car }: { car: Car }) {
  return (
    <div className="car-card group bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition">
      {/* Imagen */}
      <div className="relative w-full h-40 mb-3">
        <Image
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          fill
          className="object-contain"
        />
      </div>

      {/* Título */}
      <h2 className="font-bold text-lg text-gray-800">
        {car.brand} {car.model}
      </h2>
      <p className="text-sm text-gray-500">{car.year}</p>

      {/* Precio */}
      <p className="mt-2 text-[24px] font-extrabold text-primary-blue">
        ${car.price}
        <span className="text-sm font-medium text-gray-600"> /day</span>
      </p>
    </div>
  );
}
