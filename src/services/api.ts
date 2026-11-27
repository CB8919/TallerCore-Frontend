import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("auth");

  if (stored) {
    const user = JSON.parse(stored);

    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      error.config?.url !== "/auth/login"
    ) {
      localStorage.removeItem("auth");
      window.dispatchEvent(new Event("auth:session-expired"));
    }

    return Promise.reject(error);
  },
);

export default api;