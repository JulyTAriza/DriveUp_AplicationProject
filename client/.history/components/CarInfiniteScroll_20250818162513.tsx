"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import CarCard from "./CarCard";
import { fetchCars } from "@/utils/fetchCars";

type Car = {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
};

export default function CarInfiniteScroll({
  cars,
  width = "24rem",
  itemMinHeight = 250,
  speed = 0.5, // 👈 control velocidad
}: {
  cars: Car[];
  width?: string;
  itemMinHeight?: number;
  speed?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || cars.length === 0) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLDivElement>(
        ".infinite-scroll-item"
      );

      // Animación vertical infinita
      gsap.to(items, {
        yPercent: -100 * cars.length,
        ease: "none",
        repeat: -1,
        duration: cars.length * speed,
        modifiers: {
          yPercent: gsap.utils.wrap(-100 * cars.length, 0),
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [cars, speed]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{
        width,
        height: `${itemMinHeight * 3}px`, // 👈 solo se ven 3 cards a la vez
        perspective: "1000px",
      }}
    >
      <div className="flex flex-col">
        {cars.concat(cars).map((car, idx) => (
          <div
            key={`${car.id}-${idx}`}
            className="infinite-scroll-item"
            style={{
              minHeight: itemMinHeight,
              transform: "rotateX(10deg)", // 👈 efecto 3D
              margin: "0.5rem 0",
            }}
          >
            <CarCard car={car} />
          </div>
        ))}
      </div>
    </div>
  );
}
