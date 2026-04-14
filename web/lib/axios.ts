import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

const BASE_URL = "https://api-alam.vercel.app"; // Ganti dengan URL BE Anda

// 1. Definisikan tipe untuk response refresh token (sesuaikan dengan BE)
interface RefreshResponse {
  accessToken: string;
}

// 2. Extend tipe InternalAxiosRequestConfig untuk menambahkan properti _retry
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Penting agar cookie dari BE terkirim
});

// Interceptor Request: Menyisipkan Access Token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// Interceptor Response: Menangani Auto-Refresh Token
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Cek jika error 401 dan request belum pernah di-retry
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Panggil endpoint refresh
        // Gunakan instance axios dasar agar tidak terkena interceptor yang sama
        const res = await axios.post<RefreshResponse>(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const { accessToken } = res.data;

        // Simpan token baru ke storage
        localStorage.setItem("accessToken", accessToken);

        // Update header Authorization pada request yang gagal tadi
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Eksekusi ulang request original dengan token baru
        return api(originalRequest);
      } catch (refreshError) {
        // Jika refresh gagal (misal: refresh token di cookie sudah expired)
        localStorage.removeItem("accessToken");

        // Redirect ke login hanya jika di lingkungan browser
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
