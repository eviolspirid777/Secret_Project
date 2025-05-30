import * as signalR from "@microsoft/signalr";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";

export default class MessageSignalRService {
  private connection: signalR.HubConnection;

  constructor() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const BASE_URL = `${apiUrl}/chatHub`;

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

  public async sendMessageToUser(userId: string, message: string) {
    this.connection
      .invoke("SendMessageToUser", userId, message)
      .catch((err) => console.error(err));
  }

  public async onReceiveMessage(callback: (message: string) => void) {
    this.connection.on("ReceiveMessage", callback);
  }

  public async stopConnection() {
    await this.connection.stop();
  }
}

export const messageSignalRServiceInstance = new MessageSignalRService();
