import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { localStorageService } from "../../localStorageService/localStorageService";
import type { Status } from "@/types/Status/Status";
class UserStatusesSignalRService {
  private hubConnection: HubConnection;

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(import.meta.env.VITE_API_URL + "/statusHub", {
        accessTokenFactory: () => localStorageService.getToken() ?? "",
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log("SignalR подключён");
      })
      .catch((err) => console.error("Ошибка подключения SignalR:", err));
  }

  public async onUserStatusChange(
    callback: (userId: string, status: Status) => void
  ) {
    this.hubConnection.on("friendStatusChange", callback);
  }

  public async stopOnUserStatusChange() {
    this.hubConnection.off("friendStatusChange");
  }

  public async stopConnection() {
    await this.hubConnection.stop();
  }
}

export const userStatusesSignalRServiceInstance =
  new UserStatusesSignalRService();
