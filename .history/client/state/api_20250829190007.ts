import axios from "axios";

// -------------------------------
// Configuración base de tu API
// -------------------------------
const api = axios.create({
  baseURL: "http://localhost:8080", // URL del backend Spring Boot
});
// -------------------------------
// Interceptor para adjuntar token automáticamente
// -------------------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && token !== "null" && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
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
  characteristics: string[];
  category: {
    id: number;
    name: string;
  };
  reservedDates?: string[];
}

export interface NewCar {
  name: string;
  description: string;
  carBrand: string;
  pricePerHour: number;
  category_id: number;
  images?: File[];
  characteristics: string[];
  reservedDates?: string[];
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

export interface Category {
  id: number;
  name: string;
  cars_id: number[]; // relación con autos
}

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  role: "ADMIN" | "USER";
  password?: string; // opcional para edición
}

export interface Reservation {
  id: number;
  car_id: number;
  user_id: number;
  rentalStart: string;
  rentalEnd: string;
  status: "PENDIENTE" | "CONFIRMADA" | "CANCELADA";
}

export interface NewReservation {
  car_id: number;
  user_id: number;
  rentalStart: string;
  rentalEnd: string;
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

  create: async (formData: FormData): Promise<Car> => {
    const res = await api.post("/autos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  update: async (formData: FormData): Promise<Car> => {
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

// -------------------------------
// Endpoints de categorías
// -------------------------------
export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const res = await api.get("/categorias");
    return res.data;
  },

  getById: async (id: number): Promise<Category> => {
    const res = await api.get(`/categorias/${id}`);
    return res.data;
  },

  getByName: async (name: string): Promise<Category> => {
    const res = await api.get(`/categorias/nombre/${name}`);
    return res.data;
  },

  create: async (category: Omit<Category, "id">): Promise<Category> => {
    const res = await api.post("/categorias", category);
    return res.data;
  },

  update: async (category: Category): Promise<Category> => {
    const res = await api.put("/categorias", category);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/categorias/${id}`);
  },
};


// -------------------------------
// Endpoints de Reservas
// -------------------------------
export const reservationApi = {
  getAll: async (): Promise<Reservation[]> => {
    const res = await api.get("/reservas");
    return res.data;
  },

  getById: async (id: number): Promise<Reservation> => {
    const res = await api.get(`/reservas/${id}`);
    return res.data;
  },

  create: async (reservation: NewReservation): Promise<Reservation> => {
    const res = await api.post("/reservas", reservation);
    return res.data;
  },

  update: async (reservation: Reservation): Promise<Reservation> => {
    const res = await api.put("/reservas", reservation);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/reservas/${id}`);
  },

 };
// -------------------------------
// Endpoints de usuario-Admin
// -------------------------------
export const userApi = {
  getAll: async (): Promise<User[]> => {
    const res = await api.get("/usuarios");
    return res.data;
  },

  getById: async (id: number): Promise<User> => {
    const res = await api.get(`/usuarios/${id}`);
    return res.data;
  },

  create: async (user: Omit<User, "id">): Promise<User> => {
    const res = await api.post("/usuarios", user);
    return res.data;
  },

  update: async (user: User): Promise<User> => {
    const res = await api.put("/usuarios", user);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/usuarios/${id}`);
  },

};




export default api;
