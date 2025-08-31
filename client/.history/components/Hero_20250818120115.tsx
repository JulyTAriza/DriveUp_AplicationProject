"use client";

import dynamic from "next/dynamic";

const ModelViewer = dynamic(() => import("./ModelViewer"), { ssr: false });

const Hero = () => {
  return (
    <section className="flex flex-col md:flex-row justify-between items-start px-6 md:px-16 pt-28 pb-12">
      {/* Texto */}
      <div className="flex-1">
        <h1 className="hero__title">¿Y si hoy no fuera un día cualquiera?</h1>
        <p className="hero__subtitle">
          Un clic. Un auto. Una historia que empieza contigo.
          Rompe la rutina. Maneja tu momento.
        </p>
<button className="bg-[#001402] text-white rounded-full px-6 py-3 mt-10">
  Explorar Autos
</button>
      </div>

      {/* Carro 3D arriba a la derecha */}
      <div className="flex-1 flex justify-end items-start -mt-8 md:-mt-14">
        <ModelViewer
          url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb"
          autoRotate
        />
      </div>
    </section>
  );
};

export default Hero;
