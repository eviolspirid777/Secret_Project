import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { MediaServer } from "./services/MediaServer";
import { Peer } from "./types";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 3000;
const mediaServer = new MediaServer();

const audioProducersMap = new Map<string, string>();
const screenProducersMap = new Map<string, string>();

app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

(async () => {
  await mediaServer.initialize();
})();

io.on("connection", async (socket) => {
  console.log("Новое подключение:", socket.id);

  socket.on("join-room", async ({ userId, roomId }, callback) => {
    const user: Peer = {
      id: userId,
      socket: socket,
      consumers: new Map(),
      producers: {},
      transports: [],
    };

    try {
      const room = await mediaServer.createRoom(roomId, user);
      await socket.join(roomId);

      callback(
        room?.peers.map((p) => p.id),
        room.router.rtpCapabilities
      );
    } catch (ex) {
      const room = await mediaServer.joinRoom(roomId, user);
      await socket.join(roomId);

      callback(
        room?.peers.map((p) => p.id),
        room?.router.rtpCapabilities
      );
    }
  });

  socket.on("create-send-transport", async (roomId, userId, callback) => {
    try {
      console.log("\n[create-send-transport]");
      console.log("peerId", userId);
      console.log("roomId", roomId);
      console.log("[create-send-transport]\n");
      const transportOptions = await mediaServer.createWebRtcTransport(
        roomId,
        userId
      );
      callback(transportOptions);
    } catch (ex) {
      console.error(ex);
    }
  });

  socket.on("connect-transport", async (data, callback) => {
    const { roomId, userId, transportId, dtlsParameters } = data;
    try {
      await mediaServer.connectTransport(
        roomId,
        userId,
        transportId,
        dtlsParameters
      );
      callback && callback();
    } catch (ex) {
      console.error("Ошибка при соединении транспорта", ex);
      callback && callback();
    }
  });

  socket.on("produce-audio", async (data, callback) => {
    try {
      const { roomId, userId, sendTransportId, kind, rtpParameters } = data;
      const producer = await mediaServer.createProducer(
        roomId,
        userId,
        sendTransportId,
        kind,
        "microphone",
        rtpParameters
      );
      console.log("\n[PRODUCER_HAS_BEEN_CREATED]");
      console.log("sendTransportId", sendTransportId);
      console.log("producerId", producer.id);
      console.log("userId", userId);
      console.log("[PRDOCUER_HAS_BEEN_CREATED]\n");

      console.log("[PRDOCUER_HAS_BEEN_CREATED]\n");
      console.log("producersMapLength", audioProducersMap.size);
      for (const val in audioProducersMap.values()) {
        console.log("producersMapValues", val);
      }
      console.log("[PRDOCUER_HAS_BEEN_CREATED]\n");
      if (!audioProducersMap.has(userId)) {
        audioProducersMap.set(userId, producer.id);
        socket.to(roomId).emit("new-producer", producer.id);
      }
      callback(producer.id);
    } catch (error) {
      console.error(error), callback({ error: error });
    }
  });

  socket.on("produce-screen", async (data, callback) => {
    try {
      const { roomId, userId, sendTransportId, kind, rtpParameters } = data;
      const producer = await mediaServer.createProducer(
        roomId,
        userId,
        sendTransportId,
        kind,
        "screen",
        rtpParameters
      );
      console.log("\n[SCREEN_PRODUCER_HAS_BEEN_CREATED]");
      console.log("sendTransportId", sendTransportId);
      console.log("producerId", producer.id);
      console.log("userId", userId);
      console.log("[SCREEN_PRODUCER_HAS_BEEN_CREATED]\n");

      console.log("[SCREEN_PRODUCER_HAS_BEEN_CREATED]\n");
      console.log("producersMapLength", screenProducersMap.size);
      for (const val in screenProducersMap.values()) {
        console.log("producersMapValues", val);
      }
      console.log("[SCREEN_PRODUCER_HAS_BEEN_CREATED]\n");
      if (!screenProducersMap.has(userId)) {
        screenProducersMap.set(userId, producer.id);
        socket.to(roomId).emit("new-producer", producer.id);
      }
      callback(producer.id);
    } catch (error) {
      console.error(error), callback({ error: error });
    }
  });

  socket.on("create-recieve-transport", async (roomId, userId, callback) => {
    try {
      console.log("\n[create-recieve-transport]");
      console.log("peerId", userId);
      console.log("roomId", roomId);
      console.log("[create-recieve-transport]\n");
      const transportOptions = await mediaServer.createWebRtcTransport(
        roomId,
        userId
      );
      callback(transportOptions);
    } catch (ex) {
      console.error(ex);
    }
  });

  socket.on("consume-audio", async (data, callback) => {
    try {
      const { roomId, userId, rtpCapabilities, transportId } = data;

      const room = mediaServer.getRoom(roomId);
      const peer = room.peers.find((peer) => peer.id !== userId);
      console.log("[AUDIO_CONSUME_CREATION]");
      console.log("userId", userId);
      console.log("peerProducerUserId", peer?.id);
      console.log("producerMapLength", audioProducersMap.size);
      console.log("peerProducersLength", peer?.producers);
      console.log("[AUDIO_CONSUME_CREATION]");

      if (!peer?.producers) throw new Error("No consumers available");

      const consumerOptions = await mediaServer.createConsumer(
        roomId,
        userId,
        peer!.producers!.microphone![0].id,
        rtpCapabilities,
        transportId
      );
      console.log("AUDIO_CONSUMER_OPTIONS");
      console.log(consumerOptions);
      console.log("AUDIO_CONSUMER_OPTIONS");
      callback(consumerOptions);
    } catch (ex) {
      console.error(ex);
      callback({ error: ex });
    }
  });

  socket.on("consume-screen", async (data, callback) => {
    try {
      const { roomId, userId, rtpCapabilities, transportId } = data;

      const room = mediaServer.getRoom(roomId);
      const peer = room.peers.find((peer) => peer.id !== userId);
      console.log("[SCREEN_CONSUME_CREATION]");
      console.log("userId", userId);
      console.log("peerProducerUserId", peer?.id);
      console.log("producerMapLength", screenProducersMap.size);
      console.log("peerProducersLength", peer?.producers);
      console.log("[SCREEN_CONSUME_CREATION]");

      if (!peer?.producers) throw new Error("No consumers available");

      const consumerOptions = await mediaServer.createConsumer(
        roomId,
        userId,
        peer!.producers!.screen![0].id,
        rtpCapabilities,
        transportId
      );
      console.log("SCREEN_CONSUMER_OPTIONS");
      console.log(consumerOptions);
      console.log("SCREEN_CONSUMER_OPTIONS");
      callback(consumerOptions);
    } catch (ex) {
      console.error(ex);
      callback({ error: ex });
    }
  });

  socket.on(
    "new-audio-producer-created",
    async (roomId, userId, producerId) => {
      socket.to(roomId).emit("new-audio-producer", roomId, userId, producerId);
    }
  );

  socket.on(
    "new-screen-producer-created",
    async (roomId, userId, producerId) => {
      socket.to(roomId).emit("new-screen-producer", roomId, userId, producerId);
    }
  );

  socket.on("disconnect-from-room", async (roomId, userId) => {
    const usersIds = mediaServer.removePeer(roomId, userId);
    mediaServer.closeRoom(roomId);

    socket.to(roomId).emit("user-disconnected", usersIds);
  });
});

app.get("/", (req: Request, res: Response) => {
  console.log(
    `Server has been started at ${
      process.env.MEDIASOUP_ANNOUNCED_IP_LOCAL ??
      process.env.MEDIASOUP_ANNOUNCED_IP
    }:${port}`
  );
});

// Запуск сервера
httpServer.listen(3000, process.env.MEDIASOUP_ANNOUNCED_IP_LOCAL, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
