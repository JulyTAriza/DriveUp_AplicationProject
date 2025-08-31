"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import CarCard from "./CarCard";
import { fetchCars } from "@/utils/fetchCars";

gsap.registerPlugin(Observer);

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
  width = "25rem",
  itemMinHeight = 220,
}: {
  cars: Car[];
  width?: string;
  itemMinHeight?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (cars.length === 0) return;

    const divItems = gsap.utils.toArray(container.children) as HTMLElement[];
    if (!divItems.length) return;

    const firstItem = divItems[0];
    const itemHeight = firstItem.offsetHeight + 20; // altura + margin
    const totalHeight = itemHeight * cars.length;

    const wrapFn = gsap.utils.wrap(-totalHeight, 0);

    divItems.forEach((child, i) => {
      gsap.set(child, { y: i * itemHeight });
    });

    const observer = Observer.create({
      target: container,
      type: "wheel,touch,pointer",
      preventDefault: true,
      onChange: ({ deltaY }) => {
        divItems.forEach((child) => {
          gsap.to(child, {
            duration: 0.6,
            ease: "power3.out",
            y: `+=${-deltaY * 2}`,
            modifiers: {
              y: (y) => wrapFn(parseFloat(y)) + "px",
            },
          });
        });
      },
    });

    return () => observer.kill();
  }, [cars]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto"
      style={{
        width,
        height: `${itemMinHeight * 3}px`, // muestra 3 items visibles
        perspective: "1200px",
        transformStyle: "preserve-3d",
        overflow: "hidden",
      }}
    >
      {cars.map((car, idx) => (
        <div
          key={`${car.id}-${idx}`}
          style={{
            minHeight: itemMinHeight,
            margin: "10px 0",
            transform: `rotateX(15deg) rotateY(${
              idx % 2 === 0 ? 15 : -15
            }deg) scale(0.95)`,
            transformStyle: "preserve-3d",
          }}
        >
          <CarCard car={car} />
        </div>
      ))}
    </div>
  );
}
