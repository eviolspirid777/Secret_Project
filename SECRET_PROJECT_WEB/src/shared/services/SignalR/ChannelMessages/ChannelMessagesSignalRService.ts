import * as signalR from "@microsoft/signalr";
import { localStorageService } from "../../localStorageService/localStorageService";
import type { ChannelMessage } from "@/types/ChannelMessage/ChannelMessage";

export default class ChannelMessagesSignalRService {
  private connection: signalR.HubConnection;

  constructor() {
    const apiUrl = import.meta.env.VITE_API_URL;
    const BASE_URL = `${apiUrl}/channelMessagesHub`;

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

  public async onReciveChannelMessage(
    callback: (channelMessage: ChannelMessage) => void
  ) {
    this.connection.on("channelMessageRecived", callback);
  }

  public async stopReciveChannelMessage() {
    this.connection.off("channelMessageRecived");
  }
}

export const ChannelMessagesSignalRServiceInstance =
  new ChannelMessagesSignalRService();
