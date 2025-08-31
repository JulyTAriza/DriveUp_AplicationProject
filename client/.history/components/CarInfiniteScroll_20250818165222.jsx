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
  <section className="w-full py-5"> {/* 👉 más respiro arriba/abajo */}
    <div className="max-w-7xl mx-auto"> {/* 👉 centrado y ancho máximo */}
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
  </section>
);
}

