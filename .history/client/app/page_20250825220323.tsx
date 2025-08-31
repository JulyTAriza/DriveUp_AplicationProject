import { fetchCars } from "@utils";
import CarCard from "@components/CarCard";
import CarInfiniteScroll from "@components/CarInfiniteScroll";
import { Hero } from "@components";
import BackgroundCarousel from "@components/BackgroundCarousel"; // 👈 Importamos el carrusel de fondo

export default async function Home() {
  // Trae hasta 10 autos aleatorios de utils
  const allCars = await fetchCars();

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1;

  return (
    <>
      {/* Carrusel de fondo */}
      <BackgroundCarousel />

      <main className="overflow-hidden relative z-10"> {/* Añadimos z-10 para que el contenido quede encima */}
        <Hero />

        <div className="mt-12 padding-x padding-y max-width" id="discover">
          <div className="home__text-container">
            <h1 className="text-4xl font-extrabold">Nuestro Catálogo</h1>
            <p>Explora nuestros autos, elige uno y comienza tu historia</p>
          </div>

          {!isDataEmpty ? (
            <section>
              <div className="flex justify-center">
                <CarInfiniteScroll cars={allCars} width="100%" itemMinWidth={260} />
              </div>
            </section>
          ) : (
            <div className="home__error-container">
              <h2 className="text-black text-xl font-bold">
                Ups! No encontramos autos que coincidan...
              </h2>
            </div>
          )}
        </div>
      </main>
    </>
  );
}