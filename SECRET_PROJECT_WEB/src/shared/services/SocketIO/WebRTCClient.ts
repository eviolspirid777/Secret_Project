import { io, Socket } from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";

export class WebRTCClient {
  private socket: Socket;
  private device: mediasoupClient.types.Device;
  private sendTransport: mediasoupClient.types.Transport | null = null;
  private recvTransport: mediasoupClient.types.Transport | null = null;
  private producers: Map<string, mediasoupClient.types.Producer> = new Map();
  private consumers: Map<string, mediasoupClient.types.Consumer> = new Map();
  private localStream: MediaStream | null = null;

  constructor(serverUrl: string) {
    this.socket = io(serverUrl);
    this.device = new mediasoupClient.Device();
    this.setupSocketListeners();
  }

  private setupSocketListeners() {
    // Обработка подключения к серверу
    this.socket.on("connect", () => {
      console.log("Подключено к серверу");
    });

    // Обработка присоединения нового участника
    this.socket.on("peer-joined", async ({ peerId }) => {
      console.log("Новый участник присоединился:", peerId);
      // Здесь можно обновить UI, показать нового участника
    });

    // Обработка ухода участника
    this.socket.on("peer-left", ({ peerId }) => {
      console.log("Участник покинул комнату:", peerId);
      // Здесь можно обновить UI, убрать участника
    });

    // Обработка нового продюсера
    this.socket.on("new-producer", async ({ producerId, kind }) => {
      console.log("Новый продюсер:", producerId, kind);
      await this.consume(producerId);
    });
  }

  // Присоединение к комнате
  async joinRoom(roomId: string): Promise<void> {
    try {
      // Запрашиваем доступ к медиаустройствам
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      // Присоединяемся к комнате
      const { rtpCapabilities } = await this.socket.emitWithAck("join-room", {
        roomId,
      });

      // Загружаем RTP возможности устройства
      await this.device.load({ routerRtpCapabilities: rtpCapabilities });

      // Создаем транспорт для отправки
      await this.createSendTransport();

      // Создаем транспорт для получения
      await this.createRecvTransport();

      // Публикуем локальные потоки
      await this.publishStreams();
    } catch (error) {
      console.error("Ошибка при присоединении к комнате:", error);
      throw error;
    }
  }

  // Создание транспорта для отправки
  private async createSendTransport() {
    try {
      const { transportOptions } = await this.socket.emitWithAck(
        "create-transport",
        {
          roomId: this.socket.id,
          direction: "send",
        }
      );

      this.sendTransport = this.device.createSendTransport(transportOptions);

      // Обработчики событий транспорта
      this.sendTransport.on(
        "connect",
        async ({ dtlsParameters }, callback, errback) => {
          try {
            await this.socket.emitWithAck("connect-transport", {
              roomId: this.socket.id,
              transportId: this.sendTransport!.id,
              dtlsParameters,
            });
            callback();
          } catch (error: unknown) {
            if (error instanceof Error) {
              errback(error);
            } else {
              errback(new Error(String(error)));
            }
          }
        }
      );

      this.sendTransport.on(
        "produce",
        async ({ kind, rtpParameters }, callback, errback) => {
          try {
            const { id } = await this.socket.emitWithAck("produce", {
              roomId: this.socket.id,
              transportId: this.sendTransport!.id,
              kind,
              rtpParameters,
            });
            callback({ id });
          } catch (error: unknown) {
            if (error instanceof Error) {
              errback(error);
            } else {
              errback(new Error(String(error)));
            }
          }
        }
      );
    } catch (error) {
      console.error("Ошибка при создании транспорта отправки:", error);
      throw error;
    }
  }

  // Создание транспорта для получения
  private async createRecvTransport() {
    try {
      const { transportOptions } = await this.socket.emitWithAck(
        "create-transport",
        {
          roomId: this.socket.id,
          direction: "recv",
        }
      );

      this.recvTransport = this.device.createRecvTransport(transportOptions);

      this.recvTransport.on(
        "connect",
        async ({ dtlsParameters }, callback, errback) => {
          try {
            await this.socket.emitWithAck("connect-transport", {
              roomId: this.socket.id,
              transportId: this.recvTransport!.id,
              dtlsParameters,
            });
            callback();
          } catch (error) {
            if (error instanceof Error) {
              errback(error);
            } else {
              errback(new Error(String(error)));
            }
          }
        }
      );
    } catch (error) {
      console.error("Ошибка при создании транспорта получения:", error);
      throw error;
    }
  }

  // Публикация локальных потоков
  private async publishStreams() {
    if (!this.localStream || !this.sendTransport) return;

    // Публикуем аудио
    const audioTrack = this.localStream.getAudioTracks()[0];
    if (audioTrack) {
      const audioProducer = await this.sendTransport.produce({
        track: audioTrack,
        encodings: [
          { maxBitrate: 64000, dtx: true },
          { maxBitrate: 32000, dtx: true },
        ],
        codecOptions: {
          opusStereo: true,
          opusDtx: true,
        },
      });
      this.producers.set(audioProducer.id, audioProducer);
    }

    // Публикуем видео
    const videoTrack = this.localStream.getVideoTracks()[0];
    if (videoTrack) {
      const videoProducer = await this.sendTransport.produce({
        track: videoTrack,
        encodings: [
          { maxBitrate: 100000, scalabilityMode: "S1T3" },
          { maxBitrate: 300000, scalabilityMode: "S1T3" },
          { maxBitrate: 900000, scalabilityMode: "S1T3" },
        ],
        codecOptions: {
          videoGoogleStartBitrate: 1000,
        },
      });
      this.producers.set(videoProducer.id, videoProducer);
    }
  }

  // Подписка на поток другого участника
  private async consume(producerId: string) {
    try {
      if (!this.recvTransport) return;

      const { consumer } = await this.socket.emitWithAck("consume", {
        roomId: this.socket.id,
        producerId,
        rtpCapabilities: this.device.rtpCapabilities,
      });

      const mediaConsumer = await this.recvTransport.consume({
        id: consumer.id,
        producerId: consumer.producerId,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
      });

      this.consumers.set(consumer.id, mediaConsumer);

      // Получаем медиапоток
      const stream = new MediaStream([mediaConsumer.track]);
      // Здесь можно добавить поток в UI
      // Например: videoElement.srcObject = stream;
    } catch (error) {
      console.error("Ошибка при подписке на поток:", error);
    }
  }

  // Отключение от комнаты
  async leaveRoom() {
    // Останавливаем все продюсеры
    for (const producer of this.producers.values()) {
      producer.close();
    }
    this.producers.clear();

    // Останавливаем все консьюмеры
    for (const consumer of this.consumers.values()) {
      consumer.close();
    }
    this.consumers.clear();

    // Закрываем транспорты
    if (this.sendTransport) {
      this.sendTransport.close();
      this.sendTransport = null;
    }
    if (this.recvTransport) {
      this.recvTransport.close();
      this.recvTransport = null;
    }

    // Останавливаем локальные потоки
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    // Отключаемся от сервера
    this.socket.disconnect();
  }
}
