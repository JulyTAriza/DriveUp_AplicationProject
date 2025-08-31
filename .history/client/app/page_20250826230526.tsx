import { fetchCars } from "@utils";
import CarInfiniteScroll from "@components/CarInfiniteScroll";
import { Hero } from "@components";
import Searchbar from "@components/Searchbar";
import CustomFilter from "@components/CustomFilter";
import { fuels, yearsOfProduction } from "@constants";
import BackgroundCarousel from "@components/BackgroundCarousel";

interface SearchParams {
  q?: string;
  fuel?: string;
  year?: string;
}

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // 🚀 Pasamos los parámetros de búsqueda al fetch
  const allCars = await fetchCars({
    q: searchParams?.q || "",
    fuel: searchParams?.fuel || "",
    year: searchParams?.year || "",
  });

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1;

  return (
    <>
      {/* Carrusel de fondo */}
      <BackgroundCarousel />

      <main className="overflow-hidden relative z-10">
        <Hero />

        <div className="mt-12 padding-x padding-y max-width" id="discover">
          {/* Título y subtítulo */}
          <div className="home__text-container">
            <h1 className="text-4xl font-extrabold">Nuestro Catálogo</h1>
            <p>Explora nuestros autos, elige uno y comienza tu historia</p>
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="home__filters flex flex-col md:flex-row gap-6 mt-6">
            {/* Barra de búsqueda limpia */}
            <Searchbar />

            {/* Contenedor de filtros */}
            <div className="home__filter-container flex gap-4">
              <CustomFilter title="Fuel" options={fuels} />
              <CustomFilter title="Year" options={yearsOfProduction} />
              <CustomFilter
  title="Tipo"
  options={[
    { title: "Sedán", value: "sedan" },
    { title: "SUV", value: "suv" },
    { title: "Deportivo", value: "deportivo" },
    { title: "Pickup", value: "pickup" },
  ]}
/>

            </div>
          </div>

          {/* Catálogo de autos */}
          {!isDataEmpty ? (
            <section className="mt-12">
              <CarInfiniteScroll cars={allCars} />
            </section>
          ) : (
            <div className="home__error-container text-center mt-16">
              <h2 className="text-black text-xl font-bold">
                Ups! No encontramos autos que coincidan...
              </h2>
              <p className="text-gray-500">Prueba con otros filtros o un término diferente</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}