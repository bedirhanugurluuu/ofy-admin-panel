import axios from "axios";

type AxiosRequestConfig = Parameters<typeof axios.request>[0];

let csrfToken: string | null = null;

export function setCsrfToken(token: string) {
  csrfToken = token;
}

const instance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

instance.interceptors.request.use((config: AxiosRequestConfig) => {
  config.headers = config.headers ?? {};

  const token = localStorage.getItem("token");
  if (token) {
    (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  if (csrfToken) {
    (config.headers as Record<string, string>)["X-CSRF-Token"] = csrfToken;
  }

  return config;
});

export default instance;
