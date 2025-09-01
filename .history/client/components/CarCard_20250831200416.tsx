// components/CarCard.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import CustomButton from "./CustomButton"; // Asume que CustomButton existe y es funcional
import CarDetails from "./CarDetails"; // Asume que CarDetails está en la misma carpeta components
import { Car } from '@/state/api'; // Importa la interfaz Car de tu archivo api.ts

interface CarCardProps {
  car: Car; // Usa la interfaz Car de tu backend para tipar las propiedades del auto
}

const CarCard = ({ car }: CarCardProps) => {
  // Desestructura las propiedades directamente de tu objeto Car
  const { name, carBrand, pricePerHour, images, characteristics, description } = car;

  const [isOpen, setIsOpen] = useState(false); // Estado para controlar la apertura/cierre del modal CarDetails

  return (
    <div className="car-card group">
      <div className="car-card__content">
        <h2 className="car-card__content-title">
          {carBrand} {name} {/* Muestra la marca y el nombre del auto */}
        </h2>
      </div>

      <p className="flex mt-6 text-[32px] font-extrabold">
        <span className="self-start text-[14px] font-semibold">$</span>
        {pricePerHour} {/* Muestra el precio por hora del auto */}
        <span className="self-end text-[14px] font-medium">/hora</span>
      </p>

      <div className="relative w-full h-40 my-3 object-contain">
        {/* Muestra la primera imagen del arreglo imagePaths, o una imagen por defecto */}
        <Image
          src={imagePaths && imagePaths.length > 0 ? imagePaths[0] : '/default-car.png'}
          alt={`${name} model`}
          fill
          priority
          className="object-contain"
        />
      </div>

      <div className="relative flex w-full mt-2">
        <div className="flex group-hover:invisible w-full justify-between text-gray">
          {/* Aquí puedes mostrar íconos o texto de características importantes.
              Estos son ejemplos; ajústalos según las características que desees destacar. */}
          <div className="flex flex-col justify-center items-center gap-2">
            <Image src="/steering-wheel.svg" width={20} height={20} alt="steering wheel" />
            <p className="text-[14px]">
              {/* Ejemplo: Buscar una característica específica o mostrar un valor por defecto */}
              {characteristics && characteristics.includes("Automático") ? "Automático" : "Manual"}
            </p>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <Image src="/tire.svg" width={20} height={20} alt="tire" />
            <p className="text-[14px]">
              {carBrand} {/* Puedes mostrar la marca o alguna otra característica */}
            </p>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <Image src="/gas.svg" width={20} height={20} alt="gas" />
            <p className="text-[14px]">
              ${pricePerHour}/h {/* Puedes mostrar el precio o alguna otra característica */}
            </p>
          </div>
        </div>

        <div className="car-card__btn-container">
          <CustomButton
            title="Ver Más"
            containerStyles="w-full py-[16px] rounded-full bg-black"
            textStyles="text-white text-[14px] leading-[17px] font-bold"
            rightIcon="/right-arrow.svg"
            handleClick={() => setIsOpen(true)} // Al hacer clic, abre el modal CarDetails
          />
        </div>
      </div>

      {/* ✅ Componente CarDetails como modal, se abre cuando isOpen es true */}
      <CarDetails isOpen={isOpen} closeModal={() => setIsOpen(false)} car={car} />
    </div>
  );
};

export default CarCard;