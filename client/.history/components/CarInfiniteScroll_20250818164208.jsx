"use client";

import CarCard from "./CarCard";
import InfiniteScroll from "./InfiniteScroll"; // 👈 usa el horizontal corregido

export default function CarInfiniteScroll({ cars }) {
  if (!cars || cars.length === 0) {
    return <p>No hay autos disponibles.</p>;
  }

  // Adaptamos cars a items para InfiniteScroll
  const items = cars.map((car) => ({
    content: <CarCard car={car} />,
  }));

  return (
    <InfiniteScroll
      items={items}
      width="100%"              // 👉 ocupa todo el ancho disponible
      itemMinWidth={280}        // 👉 ancho mínimo de cada item (ajusta a tu diseño)
      isTilted={false}          // 👉 true para efecto diagonal tipo cinta transportadora
      tiltDirection="left"      // 👉 "left" o "right" si usas isTilted
      autoplay={true}           // 👉 autoplay activado
      autoplaySpeed={1}         // 👉 controla velocidad (más alto = más rápido)
      autoplayDirection="right" // 👉 "right" o "left"
      pauseOnHover={true}       // 👉 pausa cuando pasas el mouse
    />
  );
}
