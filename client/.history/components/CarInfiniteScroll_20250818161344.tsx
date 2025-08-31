// components/CarInfiniteScroll.tsx
"use client";

import CarCard from "./CarCard";
import InfiniteScroll from "./InfiniteScroll"; // tu componente gsap

type Car = {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
};

export default function CarInfiniteScroll({ cars }: { cars: Car[] }) {
  return (
    <InfiniteScroll
      width="22rem"         // ancho de cada tarjeta
      maxHeight="80vh"      // altura máxima del contenedor
      itemMinHeight={280}   // altura mínima de las cards
      isTilted={true}
      tiltDirection="left"
      autoplay={true}
      autoplaySpeed={0.8}
      autoplayDirection="down"
      pauseOnHover={true}
      items={cars.map((car) => ({
        content: <CarCard key={car.id} car={car} />,
      }))}
    />
  );
}
