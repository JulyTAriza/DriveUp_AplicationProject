"use client";

import CarCard from "./CarCard";
import Slider from "react-slick";

interface CarInfiniteScrollProps {
  cars: any[];
}

export default function CarInfiniteScroll({ cars }: CarInfiniteScrollProps) {
  if (!cars || cars.length === 0) {
    return <p>No hay autos disponibles.</p>;
  }

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,          // 🚗 se pasa solo
    autoplaySpeed: 3000,     // ⏱ cada 3s cambia de slide
    speed: 800,              // 🎞 animación de 0.8s
    arrows: true,            // ✅ flechas visibles
    pauseOnHover: true,      // se pausa al pasar el mouse
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Slider {...settings}>
      {cars.map((car, index) => (
        <div key={index} className="px-2">
          <CarCard car={car} />
        </div>
      ))}
    </Slider>
  );
}

