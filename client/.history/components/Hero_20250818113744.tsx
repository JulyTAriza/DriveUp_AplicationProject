"use client";

import dynamic from "next/dynamic";

const ModelViewer = dynamic(() => import("./ModelViewer"), { ssr: false });

const Hero = () => {
  return (
    <section className="flex flex-col md:flex-row justify-between items-start px-6 md:px-16 pt-28 pb-12">
      {/* Texto */}
      <div className="flex-1 mb-10 md:mb-0">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Find, book, rent a car—quick and super easy!
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Streamline your car rental experience with our effortless booking process.
        </p>
        <button className="bg-primary-blue text-white rounded-full px-6 py-3 mt-10 hover:bg-blue-700 transition">
          Explore Cars
        </button>
      </div>

      {/* Modelo 3D */}
      <div className="flex-1 flex justify-center md:justify-end items-start w-full max-w-[620px] mx-auto md:mx-0 -mt-8 md:-mt-14">
        <ModelViewer
          url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb"
          autoRotate
        />
      </div>
    </section>
  );
};

export default Hero;

