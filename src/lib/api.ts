import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Interceptor — agrega el token JWT a cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor — si el token expiró redirige al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── Auth ─────────────────────────────────────────────────
export const authAPI = {
  login:    (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  register: (data: { name: string; email: string; password: string }) =>
    api.post("/auth/register", data),
  profile:  () => api.get("/auth/profile"),
  updateProfile: (data: { name?: string; avatar?: string; currentPassword?: string; newPassword?: string }) =>
  api.put("/auth/profile", data),
};

// ─── Transactions ─────────────────────────────────────────
export const transactionsAPI = {
  getAll: (params?: { month?: number; year?: number; type?: string }) =>
    api.get("/transactions", { params }),
  create: (data: {
    category_id: number;
    type: "income" | "expense";
    amount: number;
    description?: string;
    date: string;
  }) => api.post("/transactions", data),
  remove:  (id: number) => api.delete(`/transactions/${id}`),
  summary: (month: number, year: number) =>
    api.get("/transactions/summary", { params: { month, year } }),
  monthly: () => api.get("/transactions/monthly"),
};

// ─── Categories ───────────────────────────────────────────
export const categoriesAPI = {
  getAll: () => api.get("/categories"),
};

export default api;
