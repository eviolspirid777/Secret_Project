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
  private room: Room | null;

  constructor() {
    this.room = null;
  }

  async initialize() {
    // Создаем медиа-воркер
    this.worker = await mediasoup.createWorker({
      logLevel: "debug",
      logTags: ["info", "ice", "dtls", "rtcp", "rtp", "srtp"],
      rtcMinPort: 10000,
      rtcMaxPort: 10100,
    });

    this.worker.on("died", () => {
      console.error(
        "mediasoup worker died, exiting in 2 seconds...",
        this.worker.pid
      );
      setTimeout(() => {
        process.exit(1);
      }, 2000);
    });
    console.log("mediasoup worker создан");
  }

  async createRoom(roomId: string, user: Peer): Promise<Room> {
    if (this.room) {
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

    this.room = room;
    return room;
  }

  async joinRoom(user: Peer) {
    const room = this.room;
    room?.peers.push(user);

    return room;
  }

  async createWebRtcTransport(peerId: string): Promise<TransportOptions> {
    if (peerId === "d1986907-4a7d-4ac1-90a5-74ee48d8ca84") {
      console.log("\n[ROOM_ID]");
      console.log("peerId", peerId);
      console.log("[ROOM_ID]\n");
    }

    const room = this.room;
    if (!room) {
      throw new Error("Комната не найдена");
    }

    const transport = await room.router.createWebRtcTransport({
      listenIps: [
        {
          ip: "0.0.0.0",
          announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP_LOCAL,
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
    peerId: string,
    transportId: string,
    dtlsParameters: any
  ): Promise<void> {
    const room = this.room;
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
    peerId: string,
    transportId: string,
    kind: "audio" | "video",
    rtpParameters: any
  ): Promise<ProducerOptions> {
    const room = this.room;
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
    peerId: string,
    producerId: string,
    rtpCapabilities: any,
    transportId: string
  ): Promise<ConsumerOptions> {
    const room = this.room;
    if (!room) {
      throw new Error("Комната не найдена");
    }

    const peer = room.peers.find((p) => p.id === peerId);
    if (!peer) {
      throw new Error("Пир не найден");
    }

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
    const room = this.room;
    if (!room) {
      throw new Error("Комната не найдена");
    }

    return room.router.rtpCapabilities;
  }

  closeRoom() {
    const room = this.room;
    if (!room) {
      return;
    }

    room.router.close();
    this.room = null;

    console.log(`Room is deleted!`);
  }

  removePeer(peerId: string) {
    const room = this.room;
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
      this.closeRoom();
    }
  }

  getRoom(): Room {
    const room = this.room;
    if (!room) {
      throw new Error("Комната не найдена");
    }
    return room;
  }

  setRoomPeer(user: Peer) {
    const room = this.room;
    if (!room) {
      throw new Error("Комната не найдена");
    }
    room.peers.push(user);
    return;
  }
}
