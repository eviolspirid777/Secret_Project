import * as mediasoup from "mediasoup";
import {
  Room,
  TransportOptions,
  ProducerOptions,
  ConsumerOptions,
  Peer,
} from "../types";

export class MediaServer {
  private worker!: mediasoup.types.Worker;
  private rooms: Map<string, Room>;

  constructor() {
    this.rooms = new Map();
  }

  async initialize() {
    // Создаем медиа-воркер
    this.worker = await mediasoup.createWorker({
      logLevel: "warn",
      rtcMinPort: 10000,
      rtcMaxPort: 10100,
    });

    console.log("mediasoup worker создан");
  }

  async createRoom(roomId: string, user: Peer): Promise<Room> {
    if (this.rooms.has(roomId)) {
      throw new Error("Комната уже существует");
    }

    // Создаем медиа-роутер
    const router = await this.worker.createRouter({
      mediaCodecs: [
        {
          kind: "audio",
          mimeType: "audio/opus",
          clockRate: 48000,
          channels: 2,
        },
        {
          kind: "video",
          mimeType: "video/VP8",
          clockRate: 90000,
          parameters: {
            "x-google-start-bitrate": 1000,
          },
        },
        {
          kind: "video",
          mimeType: "video/H264",
          clockRate: 90000,
          parameters: {
            "packetization-mode": 1,
            "profile-level-id": "42e01f",
            "level-asymmetry-allowed": 1,
          },
        },
      ],
    });

    const room: Room = {
      id: roomId,
      router,
      peers: [user],
    };

    this.rooms.set(roomId, room);
    return room;
  }

  async joinRoom(roomId: string, user: Peer) {
    const room = this.rooms.get(roomId);
    room?.peers.push(user);

    return room;
  }

  async createWebRtcTransport(
    roomId: string,
    peerId: string
  ): Promise<TransportOptions> {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error("Комната не найдена");
    }

    const transport = await room.router.createWebRtcTransport({
      listenIps: [
        {
          ip: "0.0.0.0",
          announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP || "127.0.0.1",
        },
      ],
      enableUdp: true,
      enableTcp: true,
      preferUdp: true,
    });

    const peer = room.peers.find((p) => p.id === peerId);
    if (!peer) {
      throw new Error("Пир не найден");
    }

    peer.transports.push(transport);

    return {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
      sctpParameters: transport.sctpParameters,
    };
  }

  async connectTransport(
    roomId: string,
    peerId: string,
    transportId: string,
    dtlsParameters: any
  ): Promise<void> {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error("Комната не найдена");
    }

    const peer = room.peers.find((p) => p.id === peerId);
    if (!peer) {
      throw new Error("Пир не найден");
    }

    const transport = peer.transports.find((tr) => tr.id === transportId);
    if (!transport) {
      throw new Error("Транспорт не найден");
    }

    await transport.connect({ dtlsParameters });
  }

  async createProducer(
    roomId: string,
    peerId: string,
    transportId: string,
    kind: "audio" | "video",
    rtpParameters: any
  ): Promise<ProducerOptions> {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error("Комната не найдена");
    }

    const peer = room.peers.find((p) => p.id === peerId);
    if (!peer) {
      throw new Error("Пир не найден");
    }

    const transport = peer.transports.find((tr) => tr.id === transportId);
    if (!transport) {
      throw new Error("Транспорт не найден");
    }

    const producer = await transport.produce({
      kind,
      rtpParameters,
    });

    peer.producers.push(producer);

    return {
      id: producer.id,
      kind: producer.kind,
      rtpParameters: producer.rtpParameters,
      appData: producer.appData,
    };
  }

  async createConsumer(
    roomId: string,
    peerId: string,
    producerId: string,
    rtpCapabilities: any,
    transportId: string
  ): Promise<ConsumerOptions> {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error("Комната не найдена");
    }

    const peer = room.peers.find((p) => p.id === peerId);
    if (!peer) {
      throw new Error("Пир не найден");
    }

    console.log("CANNOT_CREATE_CONSUMER");
    console.log(producerId);
    console.log(rtpCapabilities);
    console.log("CANNOT_CREATE_CONSUMER");
    if (!room.router.canConsume({ producerId, rtpCapabilities })) {
      throw new Error("Невозможно создать консьюмер");
    }

    const transport = peer.transports.find((tr) => tr.id === transportId);
    if (!transport) {
      throw new Error("Recv-транспорт не найден");
    }

    const consumer = await transport.consume({
      producerId,
      rtpCapabilities,
      paused: true,
    });

    await consumer.resume();
    peer.consumers.push(consumer);

    return {
      id: consumer.id,
      producerId: consumer.producerId,
      kind: consumer.kind,
      rtpParameters: consumer.rtpParameters,
      appData: consumer.appData,
    };
  }

  getRouterRtpCapabilities(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error("Комната не найдена");
    }

    return room.router.rtpCapabilities;
  }

  closeRoom(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return;
    }

    room.router.close();
    this.rooms.delete(roomId);
  }

  removePeer(roomId: string, peerId: string) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return;
    }

    const peer = room.peers.find((p) => p.id === peerId);
    if (!peer) {
      return;
    }

    // Закрываем все транспорты
    for (const transport of peer.transports.values()) {
      transport.close();
    }

    // Закрываем все продюсеры
    for (const producer of peer.producers.values()) {
      producer.close();
    }

    // Закрываем все консьюмеры
    for (const consumer of peer.consumers.values()) {
      consumer.close();
    }

    room.peers = room.peers.filter((p) => p.id !== peerId);

    // Если комната пуста, закрываем её
    if (room.peers.length === 0) {
      this.closeRoom(roomId);
    }
  }

  getRoom(roomId: string): Room {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error("Комната не найдена");
    }
    return room;
  }

  setRoomPeer(roomId: string, user: Peer) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error("Комната не найдена");
    }
    room.peers.push(user);
    return;
  }

  getRooms(): Map<string, Room> {
    return this.rooms;
  }
}
