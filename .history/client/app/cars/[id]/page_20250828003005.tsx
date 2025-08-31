// En app/cars/[id]/page.tsx
// Usamos "use client" porque esta página tendrá interactividad,
// como el manejo de un estado de carga o errores.
"use client";

import { useEffect, useState } from 'react';
import { carApi, Car } from '@/state/api';
import Image from 'next/image';

interface CarDetailsProps {
    params: {
        id: string;
    };
}

export default function CarDetailsPage({ params }: CarDetailsProps) {
    const { id } = params;
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCar = async () => {
            if (!id) return;
            try {
                const fetchedCar = await carApi.getById(Number(id));
                setCar(fetchedCar);
            } catch (err) {
                console.error("Error fetching car:", err);
                setError("No se pudo cargar la información del auto.");
            } finally {
                setLoading(false);
            }
        };

        fetchCar();
    }, [id]);

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
            <h1 className="text-3xl font-bold mb-4">{car.name}</h1>
            <p className="text-lg text-gray-600 mb-6">{car.carBrand}</p>

            {/* Galería de Imágenes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {car.imagePaths.map((path, index) => (
                    <div key={index} className="relative w-full h-64 rounded-lg overflow-hidden">
                        <Image
                            src={path}
                            alt={`Imagen de ${car.name}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            priority={index === 0}
                        />
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-semibold mb-4">Características</h2>
            <ul className="list-disc list-inside mb-8 text-gray-700">
                {car.characteristics.map((char, index) => (
                    <li key={index}>{char}</li>
                ))}
            </ul>

            <h2 className="text-2xl font-semibold mb-4">Descripción</h2>
            <p className="text-gray-700 mb-8">{car.description}</p>

            {/* Aquí puedes añadir el bloque para las políticas y el formulario de reserva */}
            <div className="mt-8">
                {/* Enlaza a la página de reserva */}
                <a href={`/cars/${id}/book`} className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600">
                    Reservar este auto
                </a>
            </div>
        </div>
    );
}