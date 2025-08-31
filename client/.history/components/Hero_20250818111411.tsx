"use client";

import dynamic from "next/dynamic";
import { CustomButton } from "@components";

const ModelViewer = dynamic(() => import("./ModelViewer"), {
  ssr: false, // 🔑 evita renderizar en el server
});

const Hero = () => {
  const handleScroll = () => {
    const nextSection = document.getElementById("discover");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="hero">
      <div className="flex-1 pt-36 padding-x">
        <h1 className="hero__title">
          Find, book, rent a car—quick and super easy!
        </h1>
        <p className="hero__subtitle">
          Streamline your car rental experience with our effortless booking
          process.
        </p>
        <CustomButton
          title="Explore Cars"
          containerStyles="bg-primary-blue text-white rounded-full mt-10"
          handleClick={handleScroll}
        />
      </div>

      <div className="hero__image-container">
        <ModelViewer
          url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/main/2.0/ToyCar/glTF-Binary/ToyCar.glb"
          width={500}
          height={400}
          autoRotate
        />
      </div>
    </div>
  );
};

export default Hero;
