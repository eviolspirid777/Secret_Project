import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import type {
  LoginRequest,
  LoginResponse,
} from "@/types/Autorization/Autorization";
import type {
  RegisterRequest,
  RegisterResponse,
} from "@/types/Autorization/Register";
import type { FriendRequest } from "@/types/Friend/Friend";
import type {
  MessageAddRequest,
  MessageDeleteRequest,
} from "@/types/Message/Message";
import type { ChangeUserInformationRequest } from "@/types/User/ChangeUserInformationRequest";
import type { User } from "@/types/User/User";
import type { AxiosInstance } from "axios";
import axios from "axios";

// const BASE_AUTH_URL = import.meta.env.VITE_API_URL;
const apiUrl = import.meta.env.VITE_API_URL;

const BASE_AUTH_URL = `${apiUrl}/Auth`;
const BASE_USER_URL = `${apiUrl}/api/User`;
const BASE_MESSAGE_URL = `${apiUrl}/api/Message`;

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
    localStorageService.removeUserId();
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
        `${BASE_AUTH_URL}/login`,
        data
      );

      if (response.status === 200) {
        this.sessionToken = response.data.token;
        this.expiresAt = new Date(response.data.expirationDate);

        localStorageService.setItem("sessionToken", this.sessionToken);
        localStorageService.setItem("expiresAt", response.data.expirationDate);
        localStorageService.setUserId(response.data.userId);

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
      `${BASE_AUTH_URL}/register`,
      data
    );

    return response.data;
  }

  async Logout(id: string) {
    const response = await this.client.post<boolean>(
      `${BASE_AUTH_URL}/logout`,
      null,
      {
        params: {
          id,
        },
      }
    );

    if (response.status === 200) {
      this.removeAuthorization();
      return response.data;
    }
  }

  async GetUserShortInformation(email: string) {
    const response = await this.client.get<User>(
      `${BASE_USER_URL}/user-short-information`,
      {
        params: {
          email,
        },
      }
    );

    return response.data;
  }

  async GetUserInformation(id: string) {
    const response = await this.client.get<User>(
      `${BASE_USER_URL}/user-information/${id}`
    );

    return response.data;
  }

  async ChangeUserInformation(data: ChangeUserInformationRequest) {
    const response = await this.client.post<User>(
      `${BASE_USER_URL}/change-user-information`,
      data
    );

    return response;
  }

  async GetFriendRequests(id: string) {
    const response = await this.client.get<User[]>(
      `${BASE_USER_URL}/friend/get-friend-requests`,
      {
        params: {
          id,
        },
      }
    );

    return response.data;
  }

  async GetUserFriends(userId: string) {
    const response = await this.client.get<User[]>(
      `${BASE_USER_URL}/friend/get-user-friends/${userId}`
    );

    return response.data;
  }

  async SendFriendRequest(data: FriendRequest) {
    const response = await this.client.post<never>(
      `${BASE_USER_URL}/friend/send-request`,
      data
    );

    return response.data;
  }

  async AcceptFriendRequest(data: FriendRequest) {
    const response = await this.client.post<never>(
      `${BASE_USER_URL}/friend/accept-request`,
      data
    );

    return response.data;
  }

  async DeclineFriendRequest(data: FriendRequest) {
    const response = await this.client.post<never>(
      `${BASE_USER_URL}/friend/decline-request`,
      data
    );

    return response.data;
  }

  async AddMessage(data: MessageAddRequest) {
    const response = await this.client.post<never>(
      `${BASE_MESSAGE_URL}/add`,
      data
    );

    return response.data;
  }

  async DeleteMessage(data: MessageDeleteRequest) {
    const response = await this.client.post<never>(
      `${BASE_MESSAGE_URL}/delete`,
      data
    );

    return response.data;
  }

  async ChangeMicrophoneState(id: string) {
    const response = await this.client.post<boolean>(
      `${BASE_USER_URL}/sound-states/change-microphone-state/${id}`
    );

    return response;
  }

  async ChangeHeadphonesState(id: string) {
    const response = await this.client.post<boolean>(
      `${BASE_USER_URL}/sound-states/change-headphones-state/${id}`
    );

    return response;
  }
}

export const apiClient = new ApiClient();
