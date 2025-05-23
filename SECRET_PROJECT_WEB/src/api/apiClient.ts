import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import type {
  LoginRequest,
  LoginResponse,
} from "@/types/Autorization/Autorization";
import type { AxiosInstance } from "axios";
import axios from "axios";

// const BASE_URL = import.meta.env.VITE_API_URL;
const BASE_URL = "http://localhost:8080";

class ApiClient {
  client: AxiosInstance;
  sessionToken: string | null = null;
  expiresAt: Date | null = null;

  constructor() {
    this.client = axios.create({
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async Login(data: LoginRequest) {
    const response = await this.client.post<LoginResponse>(
      `${BASE_URL}/login`,
      data
    );

    if (response.status === 200) {
      this.sessionToken = response.data.token;
      this.expiresAt = response.data.expiresAt;
      localStorageService.setItem("sessionToken", this.sessionToken);
      localStorageService.setItem("expiresAt", this.expiresAt.toISOString());
      return response.data;
    }

    throw new Error("Неудачная авторизация");
  }

  async Logout() {
    const response = await this.client.post<boolean>(`${BASE_URL}/logout`);

    if (response.status === 200) {
      this.sessionToken = null;
      this.expiresAt = null;
      return response.data;
    }
  }
}

const apiClient = new ApiClient();
export default apiClient;
