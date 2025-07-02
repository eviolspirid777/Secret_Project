import * as signalR from "@microsoft/signalr";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import type { Message } from "@/types/Message/Message";
import type { Room } from "@/types/Room/Room";
import type { UserShortDto } from "@/types/User/User";
import type { ReactionDto } from "@/types/Reaction/Reaction";

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

  public async onRecieveReaction(callback: (reaction: ReactionDto) => void) {
    this.connection.on("RecieveReaction", callback);
  }

  public async sendMessageToUser(userId: string, message: string) {
    this.connection
      .invoke("SendMessageToUser", userId, message)
      .catch((err) => console.error(err));
  }

  public async onIncommingCallReceive(callback: (user: UserShortDto) => void) {
    this.connection.on("incommingCall", callback);
  }

  public async onIncommingCallAbort(callback: (user: UserShortDto) => void) {
    this.connection.on("abortIncommingCall", callback);
  }

  public async onReceiveMessage(callback: (message: Message) => void) {
    this.connection.on("ReceiveMessage", callback);
  }

  public async onReceiveRoomCreated(callback: (room: Room) => void) {
    this.connection.on("roomCreated", callback);
  }

  public async onReceiveRoomDeleted(callback: (roomId: string) => void) {
    this.connection.on("roomDeleted", callback);
  }

  public async stopOnReceiveRoomCreated() {
    this.connection.off("roomCreated");
  }

  public async stopOnReceiveRoomDeleted() {
    this.connection.off("roomDeleted");
  }

  public async onDeleteMessage(callback: (message: Message) => void) {
    this.connection.on("DeleteMessage", callback);
  }

  public async stopOnIncommingCallReceive() {
    this.connection.off("incommingCall");
  }

  public async stopOnIncommingCallAbort() {
    this.connection.off("abortIncommingCall");
  }

  public async stopConnection() {
    await this.connection.stop();
  }
}

export const messageSignalRServiceInstance = new MessageSignalRService();
