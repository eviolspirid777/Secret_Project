import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import type {
  LoginRequest,
  LoginResponse,
} from "@/types/Autorization/Autorization";
import type {
  RegisterRequest,
  RegisterResponse,
} from "@/types/Autorization/Register";
import type {
  AddChannelRequest,
  ChannelDto,
  JoinChannelRequest,
} from "@/types/Channel/Channel";
import type { ChannelMessage } from "@/types/ChannelMessage/ChannelMessage";
import type { DeleteChannelMessageRequest } from "@/types/ChannelMessage/DeleteChannelMessageRequest";
import type { FriendRequest } from "@/types/Friend/Friend";
import type {
  GetMessagesRequest,
  Message,
  MessageDeleteRequest,
} from "@/types/Message/Message";
import type { AddMessageReactionRequest } from "@/types/Reaction/Request";
import type { Room } from "@/types/Room/Room";
import type { ChangeUserInformationRequest } from "@/types/User/ChangeUserInformationRequest";
import type { ChangeUserStatusRequest } from "@/types/User/ChangeUserStatusRequest";
import type { User } from "@/types/User/User";
import type {
  CreateUserRoomRequest,
  DeleteUserRoomRequest,
  GetUserRoomInformationRequest,
  JoinUserRoomRequest,
  UserRoom,
} from "@/types/UserRoom/UserRoom";
import type { AxiosInstance } from "axios";
import axios from "axios";

// const BASE_AUTH_URL = import.meta.env.VITE_API_URL;
const apiUrl = import.meta.env.VITE_API_URL;

const BASE_AUTH_URL = `${apiUrl}/Auth`;
const BASE_USER_URL = `${apiUrl}/api/User`;
const BASE_MESSAGE_URL = `${apiUrl}/api/Message`;
const BASE_CHANNEL_URL = `${apiUrl}/api/Channel`;
const BASE_CHANNEL_MESSAGE_URL = `${apiUrl}/api/ChannelMessage`;

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

  async ChangeUserAvatar(data: FormData) {
    const response = await this.client.postForm<string>(
      `${BASE_USER_URL}/change-user-avatar`,
      data
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

  async GetChannelInformation(id: string) {
    const response = await this.client.get<ChannelDto>(
      `${BASE_CHANNEL_URL}/get-channel-information/${id}`
    );

    return response.data;
  }

  async AddChannel(data: AddChannelRequest) {
    const response = await this.client.post<ChannelDto["id"]>(
      `${BASE_CHANNEL_URL}/add-channel`,
      data
    );

    return response.data;
  }

  async DeleteChannel(id: string) {
    const response = await this.client.delete<ChannelDto["id"]>(
      `${BASE_CHANNEL_URL}/delete-channel/${id}`
    );

    return response.data;
  }

  //#region ChannelUsers
  async JoinChannel(data: JoinChannelRequest) {
    const response = await this.client.post<never>(
      `${BASE_CHANNEL_URL}/join-channel`,
      data
    );

    return response.data;
  }

  async GetUserChannels(userId: string) {
    const response = await this.client.get<Record<string, ChannelDto>>(
      `${BASE_CHANNEL_URL}/get-user-channels/${userId}`
    );

    return response.data;
  }

  async GetChannelUsers(id: string) {
    const response = await this.client.get<User[]>(
      `${BASE_CHANNEL_URL}/channel/${id}/get-channel-users`
    );

    return response.data;
  }

  async AddUserToChannel(channelId: string, userId: string) {
    const response = await this.client.post<never>(
      `${BASE_CHANNEL_URL}/channel/${channelId}/add-user`,
      { userId }
    );

    return response.data;
  }

  async DeleteUserFromChannel(channelId: string, userId: string) {
    const response = await this.client.delete<never>(
      `${BASE_CHANNEL_URL}/channel/${channelId}/delete-user/${userId}`
    );

    return response.data;
  }

  //#endregion ChannelUsers

  //#region Channel
  async GetChannelMessages(id: string) {
    const response = await this.client.get<ChannelMessage[]>(
      `${BASE_CHANNEL_MESSAGE_URL}/get-channel-messages/${id}`
    );

    return response.data;
  }

  async AddChannelMessage(data: FormData) {
    const response = await this.client.postForm<ChannelMessage["id"]>(
      `${BASE_CHANNEL_MESSAGE_URL}/add-channel-message`,
      data
    );

    return response.data;
  }

  async DeleteChannelMessage(data: DeleteChannelMessageRequest) {
    const response = await this.client.post<never>(
      `${BASE_CHANNEL_MESSAGE_URL}/delete-channel-message`,
      data
    );

    return response.data;
  }
  //#endregion Channel

  //#region ChannelRoom
  async GetRoomInformation(channelId: string) {
    const response = await this.client.get<Room>(
      `${BASE_CHANNEL_URL}/channel/${channelId}/room`
    );

    return response.data;
  }

  async CreateRoom(channelId: string) {
    const response = await this.client.post<string>(
      `${BASE_CHANNEL_URL}/channel/${channelId}/room/create-room`
    );

    return response.data;
  }

  async DeleteRoom(channelId: string) {
    const response = await this.client.post(
      `${BASE_CHANNEL_URL}/channel/${channelId}/room/delete-room`
    );

    return response.data;
  }

  async RoomBlockUser(channelId: string, userId: string) {
    const response = await this.client.post(
      `${BASE_CHANNEL_URL}/channel/${channelId}/room/block-user/${userId}`
    );

    return response.data;
  }

  async RoomUnblockUser(channelId: string, userId: string) {
    const response = await this.client.post(
      `${BASE_CHANNEL_URL}/channel/${channelId}/room/unblock-user/${userId}`
    );

    return response.data;
  }

  async RoomMuteAudioUser(channelId: string, userId: string) {
    const response = await this.client.post(
      `${BASE_CHANNEL_URL}/channel/${channelId}/room/mute-audio-user/${userId}`
    );

    return response.data;
  }

  async RoomUnmuteAudioUser(channelId: string, userId: string) {
    const response = await this.client.post(
      `${BASE_CHANNEL_URL}/channel/${channelId}/room/unmute-audio-user/${userId}`
    );

    return response.data;
  }

  async RoomMuteVideoUser(channelId: string, userId: string) {
    const response = await this.client.post(
      `${BASE_CHANNEL_URL}/channel/${channelId}/room/mute-video-user/${userId}`
    );

    return response.data;
  }

  async RoomUnmuteVideoUser(channelId: string, userId: string) {
    const response = await this.client.post(
      `${BASE_CHANNEL_URL}/channel/${channelId}/room/unmute-video-user/${userId}`
    );

    return response.data;
  }
  //#endregion ChannelRoom

  //#region UserRoom
  async GetRoomUsers(roomId: string) {
    const response = await this.client.get<User[]>(
      `${BASE_MESSAGE_URL}/user/room/${roomId}/users`
    );

    return response.data;
  }

  async GetUserRoomInformation(data: GetUserRoomInformationRequest) {
    const response = await this.client.get<UserRoom>(
      `${BASE_MESSAGE_URL}/user/room`,
      {
        params: data,
      }
    );

    return response.data;
  }

  async JoinUserRoom(data: JoinUserRoomRequest) {
    const response = await this.client.post<UserRoom>(
      `${BASE_MESSAGE_URL}/user/room/join`,
      data
    );

    return response.data;
  }

  async CreateUserRoom(data: CreateUserRoomRequest) {
    const response = await this.client.post<string>(
      `${BASE_MESSAGE_URL}/user/room/create`,
      data
    );

    return response.data;
  }

  async DeleteUserRoom(data: DeleteUserRoomRequest) {
    const response = await this.client.post(
      `${BASE_MESSAGE_URL}/user/room/delete-room`,
      data
    );

    return response.data;
  }
  //#endregion UserRoom

  async GetMessages(data: GetMessagesRequest) {
    const response = await this.client.post<Message[]>(
      `${BASE_MESSAGE_URL}/get-messages`,
      data
    );

    return response.data;
  }

  async AddMessage(data: FormData) {
    const response = await this.client.postForm<never>(
      `${BASE_MESSAGE_URL}/add-message`,
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

  async AddMessageReaction(data: AddMessageReactionRequest) {
    const response = await this.client.post<never>(
      `${BASE_MESSAGE_URL}/add-message-reaction`,
      data
    );

    return response.data;
  }

  async RemoveMessageReaction(reactionId: string) {
    const response = await this.client.delete(
      `${BASE_MESSAGE_URL}/remove-message-reaction/${reactionId}`
    );
    return response.data;
  }

  async ChangeUserStatus(data: ChangeUserStatusRequest) {
    const response = await this.client.post<never>(
      `${BASE_USER_URL}/change-user-status`,
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
