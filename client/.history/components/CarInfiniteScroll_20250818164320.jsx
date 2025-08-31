"use client";

import CarCard from "./CarCard";
import InfiniteScroll from "./InfiniteScroll";

export default function CarInfiniteScroll({
  cars,
  width = "100%",
  itemMinWidth = 280,
  isTilted = false,
  tiltDirection = "left",
  autoplay = true,
  autoplaySpeed = 1,
  autoplayDirection = "right",
  pauseOnHover = true,
}) {
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
      width={width}
      itemMinWidth={itemMinWidth}
      isTilted={isTilted}
      tiltDirection={tiltDirection}
      autoplay={autoplay}
      autoplaySpeed={autoplaySpeed}
      autoplayDirection={autoplayDirection}
      pauseOnHover={pauseOnHover}
    />
  );
}
