// En app/cars/[id]/book/page.tsx
// Usamos "use client" para el formulario de reserva.
"use client";

import { useEffect, useState } from 'react';
import { carApi, Car } from '@/state/api';
import Image from 'next/image';

interface BookingPageProps {
    params: {
        id: string;
    };
}

export default function BookingPage({ params }: BookingPageProps) {
    const { id } = params;
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        const fetchCar = async () => {
            if (!id) return;
            try {
                const fetchedCar = await carApi.getById(Number(id));
                setCar(fetchedCar);
            } catch (err) {
                console.error("Error fetching car:", err);
                setError("No se pudo cargar la información del auto para la reserva.");
            } finally {
                setLoading(false);
            }
        };

        fetchCar();
    }, [id]);

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        // Lógica de reserva: 
        // 1. Validar fechas (no vacías, no en el pasado, etc.).
        // 2. Enviar la reserva a tu API de backend.
        // 3. Manejar la respuesta (éxito o error).
        // 4. Redirigir al usuario a una página de confirmación.
        console.log("Datos de reserva:", { carId: id, startDate, endDate });
        alert("¡Reserva realizada con éxito!");
        // Aquí iría el código para llamar a tu API de reservas
    };

    if (loading) {
        return <div className="p-8 text-center text-lg">Cargando detalles del auto...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    if (!car) {
        return <div className="p-8 text-center text-gray-500">Auto no encontrado.</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-4">Reserva tu {car.name}</h1>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                    <div className="relative w-full h-80 rounded-lg overflow-hidden mb-4">
                        {car.imagePaths.length > 0 && (
                            <Image
                                src={car.imagePaths[0]}
                                alt={`Imagen de ${car.name}`}
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        )}
                    </div>
                    <h2 className="text-xl font-semibold">{car.name}</h2>
                    <p className="text-gray-600">{car.carBrand}</p>
                    <p className="mt-2 text-xl font-bold text-blue-600">${car.pricePerHour} / hora</p>
                </div>

                <div className="md:w-1/2 bg-gray-100 p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Detalles de la reserva</h2>
                    <form onSubmit={handleBooking}>
                        <div className="mb-4">
                            <label htmlFor="startDate" className="block text-sm font-semibold mb-2">Fecha de inicio</label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="endDate" className="block text-sm font-semibold mb-2">Fecha de fin</label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600"
                        >
                            Confirmar reserva
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}