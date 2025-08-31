"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Observer } from "gsap/Observer";
import CarCard from "./CarCard"; // 👈 importa tu tarjeta
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
  width = "30rem",
  maxHeight = "100%",
  negativeMargin = "-0.5em",
  itemMinHeight = 200,
}: {
  cars: Car[];
  width?: string;
  maxHeight?: string;
  negativeMargin?: string;
  itemMinHeight?: number;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (cars.length === 0) return;

    const divItems = gsap.utils.toArray(container.children) as HTMLElement[];
    if (!divItems.length) return;

    const firstItem = divItems[0] as HTMLElement;
    const itemStyle = getComputedStyle(firstItem);
    const itemHeight = firstItem.offsetHeight;
    const itemMarginTop = parseFloat(itemStyle.marginTop) || 0;
    const totalItemHeight = itemHeight + itemMarginTop;
    const totalHeight =
      itemHeight * cars.length + itemMarginTop * (cars.length - 1);

    const wrapFn = gsap.utils.wrap(-totalHeight, totalHeight);

    divItems.forEach((child, i) => {
      const y = i * totalItemHeight;
      gsap.set(child, { y });
    });

    const observer = Observer.create({
      target: container,
      type: "wheel,touch,pointer",
      preventDefault: true,
      onChange: ({ deltaY }) => {
        divItems.forEach((child) => {
          gsap.to(child, {
            duration: 0.5,
            ease: "expo.out",
            y: `+=${-deltaY * 2}`,
            modifiers: {
              y: gsap.utils.unitize(wrapFn),
            },
          });
        });
      },
    });

    return () => observer.kill();
  }, [cars]);

  return (
    <>
      <style>
        {`
        .infinite-scroll-wrapper {
          max-height: ${maxHeight};
        }
        .infinite-scroll-container {
          width: ${width};
        }
        .infinite-scroll-item {
          height: ${itemMinHeight}px;
          margin-top: ${negativeMargin};
        }
        `}
      </style>

      <div className="infinite-scroll-wrapper" ref={wrapperRef}>
        <div className="infinite-scroll-container" ref={containerRef}>
          {cars.map((car) => (
            <div key={car.id} className="infinite-scroll-item">
              <CarCard car={car} /> {/* 👈 aquí usas tus tarjetas */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
