import { Car } from "@/state/api"; // Asegúrate de que esta ruta sea la correcta

interface FilterProps {
    q?: string;
    fuel?: string;
    year?: string;
}

// Función para mezclar un arreglo de forma aleatoria
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Función para obtener autos desde tu API de backend.
 * Se conecta a tu servidor y luego mezcla y limita los resultados.
 * @param filters - Un objeto con los parámetros de búsqueda.
 * @returns Un arreglo de objetos de tipo Car.
 */
export async function fetchCars(filters: FilterProps): Promise<Car[]> {
    try {
        const { q } = filters;
        
        // Construye la URL para tu API de backend
        const apiUrl = q 
            ? `http://localhost:8080/autos/nombre?name=${q}`
            : "http://localhost:8080/autos";

        const response = await fetch(apiUrl, {
            cache: 'no-store' // No guarda el resultado en caché, siempre busca datos nuevos
        });

        if (!response.ok) {
            if (response.status === 404 && q) {
                console.warn(`No se encontraron autos con el nombre: ${q}`);
                return [];
            }
            throw new Error(`Error al obtener los autos: ${response.statusText}`);
        }

        const allCars: Car[] = await response.json();
        
        // Mezcla los autos y devuelve solo los primeros 10
        return shuffle(allCars).slice(0, 10);
    } catch (error) {
        console.error("Error en fetchCars:", error);
        return []; // En caso de error, retorna un array vacío para no romper la UI
    }
}