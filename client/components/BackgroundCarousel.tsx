"use client";

import { useEffect, useState } from "react";

const images = [
  "/cars/carro1.jpg",
  "/cars/carro2.jpg",
  "/cars/carro3.jpg",
  "/cars/carro4.jpg",
  "/cars/carro5.jpg",
];

export default function BackgroundCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 8000); // Cambia cada 8 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`background ${index}`} // 
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-[3000ms] ${
            index === current ? "opacity-40" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
