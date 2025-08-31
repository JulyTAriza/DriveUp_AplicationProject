// pages/index.tsx (o app/page.tsx)
import { fetchCars } from "@utils";
import CarInfiniteScroll from "@components/CarInfiniteScroll";
import { Hero } from "@components";
import Searchbar from "@components/Searchbar";
import CustomFilter from "@components/CustomFilter";
import { fuels, yearsOfProduction } from "@constants";
import BackgroundCarousel from "@components/BackgroundCarousel";
import CategoriesFilter from "@/components/CatalogPage";

interface SearchParams {
  q?: string;
  fuel?: string;
  year?: string;
  categoryId?: string; // ⬅️ agregado
}

export default async function Home({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const allCars = await fetchCars({
    q: searchParams?.q || "",
    fuel: searchParams?.fuel || "",
    year: searchParams?.year || "",
    categoryId: searchParams?.categoryId || "", // ⬅️ agregado
  });

  const isDataEmpty = !Array.isArray(allCars) || allCars.length < 1;

  return (
    <>
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
            <Searchbar />

            <div className="home__filter-container flex-1 flex flex-col gap-4">
              {/* Mantienes tus filtros existentes */}
              <div className="flex gap-4 flex-wrap">
                <CustomFilter title="Fuel" options={fuels} />
                <CustomFilter title="Year" options={yearsOfProduction} />
                {/* 🔁 Quitamos el CustomFilter "Tipo" estático */}
              </div>

              {/* 🔥 Nuevo: categorías dinámicas como chips (buscador por categoría) */}
              <CategoriesFilter />
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
                ¡Ups! No encontramos autos que coincidan…
              </h2>
              <p className="text-gray-500">
                Prueba con otros filtros o un término diferente
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
