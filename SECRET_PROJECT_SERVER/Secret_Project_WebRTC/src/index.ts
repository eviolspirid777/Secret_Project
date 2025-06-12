import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { MediaServer } from "./services/MediaServer";
import { Peer } from "./types";

// Загрузка переменных окружения
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

// Middleware
app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

// Инициализация медиа-сервера
(async () => {
  await mediaServer.initialize();
})();

// Обработка WebSocket соединений
io.on("connection", async (socket) => {
  console.log("Новое подключение:", socket.id);

  // Создание или присоединение к комнате
  socket.on("join-room", async ({ roomId }, callback) => {
    try {
      let room;
      try {
        room = await mediaServer.createRoom(roomId);
      } catch (error) {
        // Если комната уже существует, просто присоединяемся
        room = mediaServer.getRoom(roomId);
      }

      const peer: Peer = {
        //TODO: вместо socket.id можно использовать id пользователя с бд.
        //  Так будет правильнее и проще регулировать текущие состояния
        id: socket.id,
        socket,
        transports: new Map(),
        producers: new Map(),
        consumers: new Map(),
      };

      room.peers.set(socket.id, peer);
      socket.join(roomId);

      // Отправляем клиенту RTP возможности роутера
      callback({
        rtpCapabilities: mediaServer.getRouterRtpCapabilities(roomId),
      });

      // Уведомляем других участников о новом пользователе
      socket.to(roomId).emit("peer-joined", { peerId: socket.id });
    } catch (error) {
      console.error("Ошибка при присоединении к комнате:", error);
      callback({ error: "Не удалось присоединиться к комнате" });
    }
  });

  // Создание WebRTC транспорта
  socket.on("create-transport", async ({ roomId }, callback) => {
    try {
      const transportOptions = await mediaServer.createWebRtcTransport(
        roomId,
        socket.id
      );
      callback({ transportOptions });
    } catch (error) {
      console.error("Ошибка при создании транспорта:", error);
      callback({ error: "Не удалось создать транспорт" });
    }
  });

  // Подключение транспорта
  socket.on(
    "connect-transport",
    async (
      {
        roomId,
        transportId,
        dtlsParameters,
      }: {
        roomId: string;
        transportId: string;
        dtlsParameters: any;
      },
      callback
    ) => {
      try {
        await mediaServer.connectTransport(
          roomId,
          socket.id,
          transportId,
          dtlsParameters
        );
        callback({ success: true });
      } catch (error) {
        console.error("Ошибка при подключении транспорта:", error);
        callback({ error: "Не удалось подключить транспорт" });
      }
    }
  );

  // Создание продюсера
  socket.on(
    "produce",
    async ({ roomId, transportId, kind, rtpParameters }, callback) => {
      try {
        const producer = await mediaServer.createProducer(
          roomId,
          socket.id,
          transportId,
          kind,
          rtpParameters
        );
        callback({ id: producer.id });

        // Уведомляем других участников о новом продюсере
        socket.to(roomId).emit("new-producer", {
          producerId: producer.id,
          kind: producer.kind,
          peerId: socket.id,
        });
      } catch (error) {
        console.error("Ошибка при создании продюсера:", error);
        callback({ error: "Не удалось создать продюсера" });
      }
    }
  );

  // Создание консьюмера
  socket.on(
    "consume",
    async ({ roomId, producerId, rtpCapabilities }, callback) => {
      try {
        const consumer = await mediaServer.createConsumer(
          roomId,
          socket.id,
          producerId,
          rtpCapabilities
        );
        callback({ consumer });
      } catch (error) {
        console.error("Ошибка при создании консьюмера:", error);
        callback({ error: "Не удалось создать консьюмера" });
      }
    }
  );

  // Обработка отключения
  socket.on("disconnect", () => {
    console.log("Отключение:", socket.id);
    // Находим все комнаты, в которых был пользователь
    for (const [roomId, room] of mediaServer.getRooms()) {
      if (room.peers.has(socket.id)) {
        mediaServer.removePeer(roomId, socket.id);
        socket.to(roomId).emit("peer-left", { peerId: socket.id });
      }
    }
  });
});

// Базовый маршрут для проверки работоспособности
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "WebRTC сервер успешно запущен!" });
});

// Запуск сервера
httpServer.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
