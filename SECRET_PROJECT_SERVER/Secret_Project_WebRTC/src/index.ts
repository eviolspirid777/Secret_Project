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

const producersIds: string[] = [];

const port = process.env.PORT || 3000;
const mediaServer = new MediaServer();

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

      const room = await mediaServer.joinRoom(roomId, user);

      socket.to(roomId).emit("user-joined", userId);
      await socket.join(roomId);

      callback(
        room?.peers.map((p) => p.id),
        room?.router.rtpCapabilities
      );
    }
  });

  socket.on("create-send-transport", async (roomId, userId, callback) => {
    const transportOptions = await mediaServer.createWebRtcTransport(
      roomId,
      userId
    );
    callback(transportOptions);
  });

  socket.on("produce", async (data, callback) => {
    try {
      const { roomId, userId, sendTransportId, kind, rtpParameters } = data;
      const producer = await mediaServer.createProducer(
        roomId,
        userId,
        sendTransportId,
        kind,
        rtpParameters
      );
      //НЕ ОТПРАВЛЯЮТСЯ...
      producersIds.push(producer.id);
      socket.emit("new-producer", { id: producer.id });
      callback(producer.id);
    } catch (error) {
      console.error(error), callback({ error: error });
    }
  });

  socket.on("create-recieve-transport", async (roomId, userId, callback) => {
    const transportOptions = await mediaServer.createWebRtcTransport(
      roomId,
      userId
    );
    //НЕ ОТПРАВЛЯЮТСЯ producerIds
    callback(transportOptions, producersIds);
  });

  socket.on("consume", async (data, callback) => {
    try {
      const { roomId, userId, producerId, rtpCapabilities, transportId } = data;
      const consumer = await mediaServer.createConsumer(
        roomId,
        userId,
        producerId,
        rtpCapabilities,
        transportId
      );
      callback(consumer);
    } catch (ex) {
      console.error(ex);
      callback({ error: ex });
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

  socket.on("disconnect-from-room", async (roomId, userId) => {
    const usersIds = mediaServer.removePeer(roomId, userId);

    socket.to(roomId).emit("user-disconnected", usersIds);
  });
});

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "WebRTC сервер успешно запущен!" });
});

// Запуск сервера
httpServer.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
