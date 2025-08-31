// lib/fetchCars.ts
export const cars = [
  { id: 1, brand: "Toyota", model: "Corolla", year: 2021, price: 200, image: "/cars/Buick-Roadmaster-92.png" },
  { id: 2, brand: "Honda", model: "Civic", year: 2022, price: 220, image: "/cars/Chevrolet-Bel-Air.png" },
  { id: 3, brand: "Ford", model: "Mustang", year: 2020, price: 350, image: "/cars/honda-civic.png" },
  { id: 4, brand: "Chevrolet", model: "Camaro", year: 2021, price: 370, image: "/cars/Oldsmobile-Rocket-88.png" },
  { id: 5, brand: "Nissan", model: "Altima", year: 2019, price: 180, image: "/cars/toyota-corolla.png" },
];

// shuffle para aleatorizar
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function fetchCars() {
  return shuffle(cars).slice(0, 10); // 👈 usa tus autos, pero aleatorios
}
