import axios from "axios";

// -------------------------------
// Configuración base de tu API
// -------------------------------
const api = axios.create({
  baseURL: "http://localhost:8080", // URL del backend Spring Boot
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
  category?: {
    id: number;
    name: string;
  };
}

export interface NewCar {
  name: string;
  description: string;
  carBrand: string;
  pricePerHour: number;
  category_id: number;
  images?: File[]; // imágenes opcionales
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

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
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
    const formData = new FormData();
    formData.append(
      "car",
      JSON.stringify({
        name: newCar.name,
        description: newCar.description,
        carBrand: newCar.carBrand,
        pricePerHour: newCar.pricePerHour,
        category: { id: newCar.category_id },
      })
    );

    if (newCar.images) {
      newCar.images.forEach((img) => {
        // ⚠️ Cambia 'images' a 'carImages' para que coincida con tu backend
        formData.append("carImages", img);
      });
    }

    const res = await api.post("/autos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  update: async (id: number, data: Partial<NewCar>): Promise<Car> => {
    const formData = new FormData();
    formData.append("car", JSON.stringify({ id, ...data }));

    if (data.images) {
      data.images.forEach((img) => {
        // ⚠️ Cambia 'images' a 'carImages' para que coincida con tu backend
        formData.append("carImages", img);
      });
    }

    const res = await api.put("/autos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
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

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },
};

export default api;