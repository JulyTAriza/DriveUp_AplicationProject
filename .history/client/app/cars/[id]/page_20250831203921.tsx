"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  carApi,
  reservationApi,
  Car,
  Reservation,
  NewReservation,
} from "@/state/api";
import { DateRange, Range, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Facebook, Twitter, Instagram } from "lucide-react";

interface CarDetailsPageProps {
  params: { id: string };
}

export default function CarDetailsPage({ params }: CarDetailsPageProps) {
  const [car, setCar] = useState<Car | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [dateRange, setDateRange] = useState<Range[]>([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);
  const [pickUp, setPickUp] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0); // índice de la galería
  const router = useRouter();
  const { id } = params;

  // Cargar auto y reservas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const carData = await carApi.getById(Number(id));
        setCar(carData);

        const allReservations = await reservationApi.getAll();
        const carReservations = allReservations.filter(
          (r) => r.car_id === Number(id)
        );
        setReservations(carReservations);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };
    fetchData();
  }, [id]);

  // Fechas bloqueadas
  const disabledDates: Date[] = reservations.flatMap((r) => {
    const start = new Date(r.rentalStart);
    const end = new Date(r.rentalEnd);
    const dates: Date[] = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  });

  // Crear reserva
  const handleReserve = async () => {
    if (!car) return;
    try {
      const userId = Number(localStorage.getItem("userId"));
      if (!userId) {
        alert("⚠️ Debes iniciar sesión para realizar una reserva.");
        router.push("/login");
        return;
      }

      const newReservation: NewReservation = {
        car_id: car.id,
        user_id: userId,
        pickUp,
        rentalStart:
          dateRange[0].startDate?.toISOString().split("T")[0] ?? "",
        rentalEnd: dateRange[0].endDate?.toISOString().split("T")[0] ?? "",
        status: "PENDIENTE",
      };

      await reservationApi.create(newReservation);
      alert("✅ Reserva realizada con éxito. Revisa tu correo.");
      router.push("/mis-reservas");
    } catch (error) {
      alert("❌ Error al crear la reserva.");
      console.error(error);
    }
  };

  if (!car) return <div className="text-center p-6">Cargando...</div>;

  const images = car.imagePaths?.length
    ? car.imagePaths
    : ["/cars/carro1.jpg", "/cars/carro2.jpg", "/cars/carro3.jpg"];

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-lg p-6">
        {/* Galería */}
        <div className="flex flex-col gap-4">
          {/* Imagen principal con botones */}
          <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg group">
            <Image
              src={images[currentIndex]}
              alt={car.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Botones navegación */}
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full hover:bg-black/70 transition"
            >
              ◀
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full hover:bg-black/70 transition"
            >
              ▶
            </button>
          </div>

          {/* Miniaturas */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {images.map((img, index) => (
              <div
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative w-full h-24 rounded-lg overflow-hidden shadow-md cursor-pointer border-2 transition ${
                  index === currentIndex
                    ? "border-green-500"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image
                  src={img}
                  alt={`${car.name} ${index}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Detalles */}
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold">
            {car.carBrand} {car.name}
          </h1>
          <p className="text-2xl text-green-600 font-semibold">
            ${car.pricePerHour} / hora
          </p>
          <p className="text-gray-700">{car.description}</p>

          {/* Disponibilidad */}
          <div className="mt-2">
            <h3 className="font-semibold mb-2">Disponibilidad</h3>
            <DateRange
              ranges={dateRange}
              onChange={(ranges: RangeKeyDict) =>
                setDateRange([ranges.selection])
              }
              minDate={new Date()}
              disabledDates={disabledDates}
              rangeColors={["#16a34a"]}
            />
          </div>

          {/* Lugar de recogida */}
          <input
            type="text"
            placeholder="Lugar de recogida"
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={pickUp}
            onChange={(e) => setPickUp(e.target.value)}
          />

          {/* Botón de reservar */}
          <button
            onClick={handleReserve}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-semibold shadow-md transition"
          >
            Reservar este Auto
          </button>

          {/* Políticas */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold underline">
              Políticas del Auto
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-gray-700">
              <li>
                <strong>No fumar:</strong> Está prohibido fumar en el vehículo.
              </li>
              <li>
                <strong>Tanque lleno:</strong> Devuelva el auto con el tanque lleno.
              </li>
              <li>
                <strong>Licencia:</strong> Debe presentar licencia válida.
              </li>
              <li>
                <strong>Puntualidad:</strong> Respete la hora de devolución.
              </li>
            </ul>
          </div>

          {/* Compartir en redes */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Compartir en redes</h3>
            <div className="flex gap-5 text-3xl text-gray-600">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition"
              >
                <Facebook size={24} />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : ""
                )}&text=Mira este auto para reservar 🚗`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-500 transition"
              >
                <Twitter size={24} />
              </a>
              <a
                href={`https://www.instagram.com/?url=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500 transition"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
