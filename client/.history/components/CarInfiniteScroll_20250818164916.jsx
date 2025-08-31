"use client";

import CarCard from "./CarCard";
import InfiniteScroll from "./InfiniteScroll";

export default function CarInfiniteScroll({
  cars,
  width = "100%",
  itemMinWidth = 220,       // 👈 más angosto para que entren más
  isTilted = true,          // 👈 activamos cinta transportadora
  tiltDirection = "left",
  autoplay = true,
  autoplaySpeed = 1.2,      // 👈 velocidad más fluida
  autoplayDirection = "right",
  pauseOnHover = true,
}) {
  if (!cars || cars.length === 0) {
    return <p>No hay autos disponibles.</p>;
  }

  // Adaptamos cars a items para InfiniteScroll
  const items = cars.map((car) => ({
    content: (
      <div className="px-2">   {/* 👉 margen lateral más sutil */}
        <CarCard car={car} />
      </div>
    ),
  }));

  return (
    <div className="w-full overflow-hidden"> {/* 👉 asegura que no se corte raro */}
      <InfiniteScroll
        items={items}
        width={width}
        itemMinWidth={itemMinWidth}
        isTilted={isTilted}
        tiltDirection={tiltDirection}
        autoplay={autoplay}
        autoplaySpeed={autoplaySpeed}
        autoplayDirection={autoplayDirection}
        pauseOnHover={pauseOnHover}
      />
    </div>
  );
}

