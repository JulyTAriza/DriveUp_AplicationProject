import axios from "axios";

// Configuración base de tu API
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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  id: number;
  email: string;
  rol: "ADMIN" | "USER";
}
// -------------------------------
// Endpoints de autos
// -------------------------------
export const carApi = {
  getAll: async (): Promise<Car[]> => {
    const res = await api.get("/autos");
    return res.data;
  },

  getById: async (id: number): Promise<Car> => {
    const res = await api.get(`/autos/${id}`);
    return res.data;
  },

  create: async (newCar: NewCar): Promise<Car> => {
    const res = await api.post("/autos", newCar);
    return res.data;
  },

  update: async (id: number, data: Partial<NewCar>): Promise<Car> => {
    const res = await api.put(`/autos/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/autos/${id}`);
  },

  findByBrand: async (carBrand: string): Promise<Car[]> => {
    const res = await api.get(`/autos/marca/${carBrand}`);
    return res.data;
  },

  findByName: async (name: string): Promise<Car[]> => {
    const res = await api.get(`/autos/nombre?name=${name}`);
    return res.data;
  },
};

// -------------------------------
// Endpoints de auth
// -------------------------------
export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await api.post("/auth/login", data);
    return res.data;
  },
};

export default api;
