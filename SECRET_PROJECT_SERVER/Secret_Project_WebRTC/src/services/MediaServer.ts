import * as mediasoup from "mediasoup";
import {
  Room,
  TransportOptions,
  ProducerOptions,
  ConsumerOptions,
  Peer,
  ProducerPeer,
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
    if (peerId === "d1986907-4a7d-4ac1-90a5-74ee48d8ca84") {
      console.log("\n[ROOM_ID]");
      console.log("peerId", peerId);
      console.log("[ROOM_ID]\n");
    }

    const room = this.rooms.get(roomId);
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
    type: keyof ProducerPeer,
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

    //TODO: вот тут можно добавить ранжирование по id, что будет в разы лучше. Типа id 1 отвчает за screenShare и.т.д
    if (!peer.producers[type]) {
      peer.producers[type] = [producer];
    } else {
      peer.producers[type].push(producer);
    }

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

    if (peer.consumers.has(producerId)) {
      //TODO: тут надо подумать над тем, чтобы получать на то ЧТО именно ты думаешь получать
      const consumerFromMap = peer.consumers.get(producerId)!;
      if (consumer.kind === "audio") {
        consumerFromMap.microphone = consumer;
      } else {
        consumerFromMap.screen = consumer;
      }
    } else {
      if (consumer.kind === "audio") {
        peer.consumers.set(producerId, {
          microphone: consumer,
        });
      } else {
        peer.consumers.set(producerId, {
          screen: consumer,
        });
      }
    }

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

    console.log(`Room is deleted!`);
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
    if (peer.producers.microphone) {
      peer.producers.microphone.forEach((producer) => producer.close());
    }

    if (peer.producers.screen) {
      peer.producers.screen.forEach((producer) => producer.close());
    }

    if (peer.producers.video) {
      peer.producers.video.forEach((producer) => producer.close());
    }

    // Закрываем все консьюмеры
    for (const consumer of peer.consumers.values()) {
      consumer.microphone?.close();
      consumer.screen?.close();
      consumer.video?.close();
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

  setRoomPeer(user: Peer, roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error("Комната не найдена");
    }
    room.peers.push(user);
    return;
  }
}
