
const cars = [
  { id: 1, brand: "Toyota", model: "Corolla", year: 2021, price: 200, image: "/cars/toyota-corolla.png" },
  { id: 2, brand: "Honda", model: "Civic", year: 2022, price: 220, image: "/cars/honda-civic.png" },
  { id: 3, brand: "Ford", model: "Mustang", year: 2020, price: 350, image: "/cars/ford-mustang.png" },
  { id: 4, brand: "Chevrolet", model: "Camaro", year: 2021, price: 370, image: "/cars/chevrolet-camaro.png" },
  { id: 5, brand: "Nissan", model: "Altima", year: 2019, price: 180, image: "/cars/nissan-altima.png" },
  { id: 6, brand: "Kia", model: "Forte", year: 2022, price: 195, image: "/cars/kia-forte.png" },
  { id: 7, brand: "BMW", model: "Serie 3", year: 2021, price: 400, image: "/cars/bmw-3series.png" },
  { id: 8, brand: "Audi", model: "A4", year: 2022, price: 420, image: "/cars/audi-a4.png" },
  { id: 9, brand: "Mercedes-Benz", model: "Clase C", year: 2020, price: 450, image: "/cars/mercedes-cclass.png" },
  { id: 10, brand: "Mazda", model: "3", year: 2021, price: 210, image: "/cars/mazda-3.png" }
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
  return shuffle(cars).slice(0, 10);
}