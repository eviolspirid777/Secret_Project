import * as signalR from "@microsoft/signalr";
import { localStorageService } from "../../localStorageService/localStorageService";

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
