"use client";

import dynamic from "next/dynamic";

const ModelViewer = dynamic(() => import("./ModelViewer"), { ssr: false });

const Hero = () => {
  return (
    <section className="flex flex-col md:flex-row justify-between items-start px-6 md:px-16 pt-28 pb-12">
      {/* Texto */}
      <div className="flex-1">
        <h1 className="hero__title">Find, book, rent a car—quick and super easy!</h1>
        <p className="hero__subtitle">
          Streamline your car rental experience with our effortless booking process.
        </p>
        <button className="bg-primary-blue text-white rounded-full px-6 py-3 mt-10">
          Explore Cars
        </button>
      </div>

      {/* Carro 3D arriba a la derecha */}
      <div className="flex-1 flex justify-end items-start -mt-8 md:-mt-14">
        <ModelViewer
          url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb"
          width={620}
          height={460}
          autoRotate
        />
      </div>
    </section>
  );
};

export default Hero;
