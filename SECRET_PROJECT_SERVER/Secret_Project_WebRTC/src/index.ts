import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
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

const producersMap = new Map<string, string>();

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
    try {
      const user: Peer = {
        id: userId,
        socket: socket,
        consumers: [],
        producers: [],
        transports: [],
      };

      const room = await mediaServer.createRoom(roomId, user);

      await socket.join(roomId);

      callback(
        room?.peers.map((p) => p.id),
        room.router.rtpCapabilities
      );
    } catch (ex) {
      const user: Peer = {
        id: userId,
        socket: socket,
        consumers: [],
        producers: [],
        transports: [],
      };

      const room = await mediaServer.joinRoom(user);

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
      const transportOptions = await mediaServer.createWebRtcTransport(userId);
      callback(transportOptions);
    } catch (ex) {
      console.error(ex);
    }
  });

  socket.on("connect-transport", async (data, callback) => {
    const { userId, transportId, dtlsParameters } = data;
    try {
      await mediaServer.connectTransport(userId, transportId, dtlsParameters);
      callback && callback();
    } catch (ex) {
      console.error("Ошибка при соединении транспорта", ex);
      callback && callback();
    }
  });

  socket.on("produce", async (data, callback) => {
    try {
      const { roomId, userId, sendTransportId, kind, rtpParameters } = data;
      const producer = await mediaServer.createProducer(
        userId,
        sendTransportId,
        kind,
        rtpParameters
      );
      console.log("\n[PRODUCER_HAS_BEEN_CREATED]");
      console.log("sendTransportId", sendTransportId);
      console.log("producerId", producer.id);
      console.log("userId", userId);
      console.log("[PRDOCUER_HAS_BEEN_CREATED]\n");

      console.log("[PRDOCUER_HAS_BEEN_CREATED]\n");
      console.log("producersMapLength", producersMap.size);
      for (const val in producersMap.values()) {
        console.log("producersMapValues", val);
      }
      console.log("[PRDOCUER_HAS_BEEN_CREATED]\n");
      if (!producersMap.has(userId)) {
        producersMap.set(userId, producer.id);
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
      const transportOptions = await mediaServer.createWebRtcTransport(userId);
      callback(transportOptions);
    } catch (ex) {
      console.error(ex);
    }
  });

  socket.on("consume", async (data, callback) => {
    try {
      const { roomId, userId, rtpCapabilities, transportId } = data;

      const room = mediaServer.getRoom();
      const peer = room.peers.find((peer) => peer.id !== userId);
      console.log("[CONSUME_CREATION]");
      console.log("userId", userId);
      console.log("peerProducerUserId", peer?.id);
      console.log("producerMapLength", producersMap.size);
      console.log("peerProducersLength", peer?.producers.length);
      console.log("[CONSUME_CREATION]");

      if (peer?.producers.length === 0 || !peer?.producers.length)
        throw new Error("No consumers available");

      const consumerOptions = await mediaServer.createConsumer(
        userId,
        peer!.producers[0].id,
        rtpCapabilities,
        transportId
      );
      console.log("CONSUMER_OPTIONS");
      console.log(consumerOptions);
      console.log("CONSUMER_OPTIONS");
      callback(consumerOptions);
    } catch (ex) {
      console.error(ex);
      callback({ error: ex });
    }
  });

  socket.on("new-producer-created", async (roomId, userId, producerId) => {
    socket.to(roomId).emit("new-producer", roomId, userId, producerId);
  });

  socket.on("disconnect-from-room", async (roomId, userId) => {
    const usersIds = mediaServer.removePeer(roomId);
    mediaServer.closeRoom();

    socket.to(roomId).emit("user-disconnected", usersIds);
  });
});

app.get("/", (req: Request, res: Response) => {
  const room = mediaServer.getRoom();
  console.log(room);

  res.json(room);
});

// Запуск сервера
httpServer.listen(3000, process.env.MEDIASOUP_ANNOUNCED_IP_LOCAL, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
