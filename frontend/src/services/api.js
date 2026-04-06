import axios from 'axios'

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000/api" : "/api";

const api = axios.create({
    baseURL: BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token")

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
});

export default api