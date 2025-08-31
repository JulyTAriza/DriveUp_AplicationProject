// utils/fetchCars.ts
export async function fetchCars() {
  const response = await fetch("http://localhost:8080/api/cars");
  if (!response.ok) throw new Error("Error fetching cars");
  return response.json();
}

