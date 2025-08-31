import { Car } from "@/state/api"; // Asegúrate de que esta ruta sea la correcta

interface FilterProps {
    q?: string; // Corresponde al 'name' del auto en tu backend
    fuel?: string; // No está implementado en tu backend, pero se mantiene para la estructura
    year?: string; // No está implementado en tu backend, pero se mantiene para la estructura
}

/**
 * Función para obtener autos desde tu API de backend.
 * @param filters - Un objeto con los parámetros de búsqueda.
 * @returns Un arreglo de objetos de tipo Car.
 */
export async function fetchCars(filters: FilterProps): Promise<Car[]> {
    try {
        const { q } = filters;
        
        // Construye la URL para tu API de backend
        // Si 'q' (nombre) existe, usa el endpoint de búsqueda por nombre.
        // Si no, usa el endpoint para obtener todos los autos.
        const apiUrl = q 
            ? `http://localhost:8080/autos/nombre?name=${q}`
            : "http://localhost:8080/autos";

        const response = await fetch(apiUrl, {
            // Se puede agregar un cache para un mejor rendimiento
            cache: 'no-store'
        });

        if (!response.ok) {
            // Manejo de errores
            if (response.status === 404 && q) {
                console.warn(`No se encontraron autos con el nombre: ${q}`);
                return [];
            }
            throw new Error(`Error al obtener los autos: ${response.statusText}`);
        }

        const data: Car[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error en fetchCars:", error);
        return []; // En caso de error, retorna un array vacío para no romper la UI
    }
}