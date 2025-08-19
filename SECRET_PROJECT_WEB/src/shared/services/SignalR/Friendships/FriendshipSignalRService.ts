import * as signalR from "@microsoft/signalr";
import { localStorageService } from "../../localStorageService/localStorageService";
import type { FriendshipStatusChangeType } from "@/types/Friend/Friend";

export default class FriendshipSignalRService {
  private connection: signalR.HubConnection;

  constructor() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const BASE_URL = `${apiUrl}/friendHub`;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(BASE_URL, {
        accessTokenFactory: () => localStorageService.getToken() ?? "",
      })
      .withAutomaticReconnect()
      .build();

    this.connection
      .start()
      .then(() => {
        console.log("SignalR подключён");
      })
      .catch((err) => console.error("Ошибка подключения SignalR:", err));
  }

  public async onReceiveFriendshipRequest(
    callback: (friendId: string) => void
  ) {
    this.connection.on("ReceiveFriendRequest", callback);
  }

  public async onReceiveFriendStatusChange(
    callback: (data: FriendshipStatusChangeType) => void
  ) {
    this.connection.on("ReceiveFriendStatusChange", callback);
  }

  public async stopReceiveFriendStatusChange() {
    this.connection.off("ReceiveFriendStatusChange");
  }

  public async stopOnReceiveFriendshipRequest() {
    this.connection.off("ReceiveFriendRequest");
  }

  public async sendFriendshipRequest(friendId: string) {
    await this.connection
      .invoke(
        "SendFriendRequestToUser",
        localStorageService.getUserId(),
        friendId
      )
      .catch((err) => console.error(err));
  }
}

export const friendshipSignalRServiceInstance = new FriendshipSignalRService();
