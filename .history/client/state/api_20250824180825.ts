import axios from "axios";

// 👇 Configuración base de tu API
const api = axios.create({
  baseURL: "http://localhost:8080", // URL de tu backend Spring Boot
  headers: {
    "Content-Type": "application/json",
  },
});

// -------------------------------
// Tipos
// -------------------------------
export interface Car {
  id: number;
  name: string;
  description: string;
  carBrand: string;
  pricePerHour: number;
  imagePaths: string[];
}

export interface NewCar {
  name: string;
  description: string;
  carBrand: string;
  pricePerHour: number;
  category_id: number;
}

// -------------------------------
// Endpoints
// -------------------------------
export const carApi = {
  // Listar todos
  getAll: async (): Promise<Car[]> => {
    const res = await api.get("/autos");
    return res.data;
  },

  // Buscar por id
  getById: async (id: number): Promise<Car> => {
    const res = await api.get(`/autos/${id}`);
    return res.data;
  },

  // Crear
  create: async (newCar: NewCar): Promise<Car> => {
    const res = await api.post("/autos", newCar);
    return res.data;
  },

  // Actualizar
  update: async (id: number, data: Partial<NewCar>): Promise<Car> => {
    const res = await api.put(`/autos/${id}`, data);
    return res.data;
  },

  // Eliminar
  delete: async (id: number): Promise<void> => {
    await api.delete(`/autos/${id}`);
  },

  // Buscar por marca
  findByBrand: async (carBrand: string): Promise<Car[]> => {
    const res = await api.get(`/autos/marca/${carBrand}`);
    return res.data;
  },

  // Buscar por nombre
  findByName: async (name: string): Promise<Car[]> => {
    const res = await api.get(`/autos/nombre?name=${name}`);
    return res.data;
  },
};

export default api;

