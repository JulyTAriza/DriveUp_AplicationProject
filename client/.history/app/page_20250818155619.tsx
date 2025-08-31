import { fetchCars } from "@utils";
import CarCard from "@components/CarCard";
import { Hero } from "@components";

export default async function Home() {
  // Trae hasta 10 autos aleatorios de utils
  const allCars = await fetchCars();

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1;

  return (
    <main className="overflow-hidden">
      <Hero />

      <div className="mt-12 padding-x padding-y max-width" id="discover">
        <div className="home__text-container">
          <h1 className="text-4xl font-extrabold">Nuestro Catálogo</h1>
          <p>Explora nuestros autos, elige uno y comienza tu historia</p>
        </div>

        {!isDataEmpty ? (
          <section>
            <div className="home__cars-wrapper grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
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
  );
}
