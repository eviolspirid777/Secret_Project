import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import type {
  LoginRequest,
  LoginResponse,
} from "@/types/Autorization/Autorization";
import type {
  RegisterRequest,
  RegisterResponse,
} from "@/types/Autorization/Register";
import type { AxiosInstance } from "axios";
import axios from "axios";

// const BASE_URL = import.meta.env.VITE_API_URL;
const apiUrl = import.meta.env.VITE_API_URL;
const BASE_URL = `${apiUrl}/Auth`;

class ApiClient {
  client: AxiosInstance;
  sessionToken: string | null = null;
  expiresAt: Date | null = null;
  private tokenTimeoutId: NodeJS.Timeout | null = null;

  constructor() {
    this.client = axios.create({
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private removeAuthorization() {
    this.client.defaults.headers.common["Authorization"] = null;
    this.sessionToken = null;
    this.expiresAt = null;
    if (this.tokenTimeoutId) {
      clearTimeout(this.tokenTimeoutId);
      this.tokenTimeoutId = null;
    }
    localStorageService.removeItem("sessionToken");
    localStorageService.removeItem("expiresAt");
  }

  private setupTokenExpiration(expirationDate: string) {
    const expiration = new Date(expirationDate);
    const now = new Date();
    const timeUntilExpiration = expiration.getTime() - now.getTime();

    if (this.tokenTimeoutId) {
      clearTimeout(this.tokenTimeoutId);
    }

    this.tokenTimeoutId = setTimeout(() => {
      this.removeAuthorization();
    }, timeUntilExpiration);

    console.log(
      `Токен истечет через ${Math.floor(timeUntilExpiration / 1000 / 60)} минут`
    );
  }

  async Login(data: LoginRequest) {
    try {
      const response = await this.client.post<LoginResponse>(
        `${BASE_URL}/login`,
        data
      );

      if (response.status === 200) {
        this.sessionToken = response.data.token;
        this.expiresAt = new Date(response.data.expirationDate);

        localStorageService.setItem("sessionToken", this.sessionToken);
        localStorageService.setItem("expiresAt", response.data.expirationDate);

        this.client.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${this.sessionToken}`;

        this.setupTokenExpiration(response.data.expirationDate);

        return response.data;
      }

      throw new Error("Неудачная авторизация");
    } catch (error) {
      this.removeAuthorization();
      throw error;
    }
  }

  async Register(data: RegisterRequest) {
    const response = await this.client.post<RegisterResponse>(
      `${BASE_URL}/register`,
      data
    );

    return response.data;
  }

  async Logout() {
    const response = await this.client.post<boolean>(`${BASE_URL}/logout`);

    if (response.status === 200) {
      this.removeAuthorization();
      return response.data;
    }
  }
}

const apiClient = new ApiClient();
export default apiClient;
