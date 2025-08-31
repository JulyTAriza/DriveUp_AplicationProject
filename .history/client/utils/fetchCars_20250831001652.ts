import { Car } from "@/state/api"; // Asegúrate de que esta ruta sea la correcta para tu interfaz Car


// Función para mezclar un arreglo de forma aleatoria, como la tenías en tu código original
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Función que obtiene los autos de tu API de Spring Boot y los mezcla.
 * @param filters - Un objeto con los parámetros de búsqueda.
 * @returns Un arreglo de objetos de tipo Car.
 */
export async function fetchCars(filters: FilterProps): Promise<Car[]> {
    try {
        const { q } = filters;
        
        // Aquí es donde la función se conecta a tu backend
        const apiUrl = q 
            ? `http://localhost:8080/autos/nombre?name=${q}`
            : "http://localhost:8080/autos";

        const response = await fetch(apiUrl, {
            cache: 'no-store'
        });

        if (!response.ok) {
            if (response.status === 404 && q) {
                console.warn(`No se encontraron autos con el nombre: ${q}`);
                return [];
            }
            throw new Error(`Error al obtener los autos: ${response.statusText}`);
        }

        const allCars: Car[] = await response.json();
        
        // Mezcla la lista de autos obtenida del backend y devuelve solo los primeros 10
        return shuffle(allCars).slice(0, 10);
    } catch (error) {
        console.error("Error en fetchCars:", error);
        return [];
    }
}