import type {
  ConnectTransportRequest,
  ConsumerRequest,
  CreateReceiveTransportRequest,
  CreateSendTransportRequest,
  JoinRoomRequest,
  NewProducer,
  ProduceRequest,
} from "@/types/SocketIO/SocketIO";
import type {
  ConsumerOptions,
  MediaKind,
  RtpCapabilities,
  TransportOptions,
} from "mediasoup-client/types";
import { io, type Socket } from "socket.io-client";

export class SocketIOConnection {
  private socket: Socket | null = null;

  constructor() {
    this.socket = io(import.meta.env.VITE_WEBRTC_URL);
    console.log("[SocketIOConnection] instance created");
  }

  async emitJoinRoom(
    data: JoinRoomRequest,
    callback: (response: {
      rtpCapabilities: RtpCapabilities;
      roomId: string;
      userId: string;
      error?: string;
      existingProducers?: {
        producerId: string;
        kind: MediaKind;
        peerId: string;
      }[];
    }) => Promise<void>
  ) {
    this.socket?.emit("join-room", data, callback);
  }

  async emitCreateSendTransport(
    data: CreateSendTransportRequest,
    callback: (transportOptions: TransportOptions) => Promise<void>
  ) {
    this.socket?.emit("create-send-transport", data, callback);
  }

  async emitCreateRecieveTransport(
    data: CreateReceiveTransportRequest,
    callback: (transportOptions: TransportOptions) => Promise<void>
  ) {
    this.socket?.emit("create-recieve-transport", data, callback);
  }

  async emitConnectTransport(
    data: ConnectTransportRequest,
    callback: () => void
  ) {
    this.socket?.emit("connect-transport", data, callback);
  }

  async emitConsume(
    data: ConsumerRequest,
    callback: (consumer: ConsumerOptions) => Promise<void>
  ) {
    this.socket?.emit("consume", data, callback);
  }

  async emitProduce(data: ProduceRequest, callback: (id: string) => void) {
    console.log("[emitProduce] called", data);
    this.socket?.emit("produce", data, callback);
  }

  async onNewProducer(callback: (response: NewProducer) => Promise<void>) {
    this.socket?.on("new-producer", callback);
  }

  async onPeerJoined() {
    this.socket?.on("peer-joined", async (data) => {
      console.log("new-peer", data);
    });
  }

  getSocketId() {
    return this.socket?.id;
  }

  async disconnect(roomId: string) {
    this.socket?.emit("delete-room", roomId);
    this.socket?.disconnect();
  }

  async emitGetProducers(
    data: { roomId: string; userId: string },
    callback: (
      producers: { producerId: string; kind: string; peerId: string }[]
    ) => void
  ) {
    this.socket?.emit("get-producers", data, callback);
  }
}

let socketIOConnectionInstance: SocketIOConnection | null = null;

export function getSocketIOConnectionInstance() {
  if (!socketIOConnectionInstance) {
    socketIOConnectionInstance = new SocketIOConnection();
  }
  return socketIOConnectionInstance;
}
