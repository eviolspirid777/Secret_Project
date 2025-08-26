import * as signalR from "@microsoft/signalr";
import { localStorageService } from "../../localStorageService/localStorageService";
import type { ChannelMessage } from "@/types/ChannelMessage/ChannelMessage";
import type { Room } from "@/types/Room/Room";
import type { ReactionDto } from "@/types/Reaction/Reaction";

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

  public async OnReciveAudioRoomCreated(callback: (room: Room) => void) {
    this.connection.on("roomCreated", callback);
  }

  public async OnReciveAudioRoomDeleted(callback: (roomId: string) => void) {
    this.connection.on("roomDeleted", callback);
  }

  public async OnRecieveChannelReaction(
    callback: (reaction: ReactionDto & { id: string }) => void
  ) {
    this.connection.on("RecieveChannelReaction", callback);
  }

  public async StopRecieveChannelReaction() {
    this.connection.off("RecieveChannelReaction");
  }

  public async StopReciveAudioRoomCreated() {
    this.connection.off("roomCreated");
  }

  public async StopReciveAudioRoomDeleted() {
    this.connection.off("roomDeleted");
  }

  public async StopReciveChannelMessage() {
    this.connection.off("channelMessageRecived");
  }
}

export const ChannelMessagesSignalRServiceInstance =
  new ChannelMessagesSignalRService();
