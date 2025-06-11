import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";

export const useWebRTC = (roomId: string | null) => {
  const socketRef = useRef<any>(null);
  const deviceRef = useRef<any>(null);
  const sendTransportRef = useRef<any>(null);
  const recvTransportRef = useRef<any>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);

  useEffect(() => {
    // 1. Подключение к серверу
    socketRef.current = io(import.meta.env.VITE_WEBRTC_URL); // или ваш адрес сервера

    // 2. Присоединение к комнате
    socketRef.current.emit("join-room", { roomId }, async (response: any) => {
      if (response.error) {
        alert(response.error);
        return;
      }
      deviceRef.current = new mediasoupClient.Device();
      await deviceRef.current.load({
        routerRtpCapabilities: response.rtpCapabilities,
      });

      // Создание транспорта для отправки
      socketRef.current.emit(
        "create-transport",
        { roomId },
        async ({ transportOptions }: any) => {
          sendTransportRef.current =
            deviceRef.current.createSendTransport(transportOptions);

          sendTransportRef.current.on(
            "connect",
            ({ dtlsParameters }: any, callback: any) => {
              socketRef.current.emit(
                "connect-transport",
                {
                  roomId,
                  transportId: sendTransportRef.current.id,
                  dtlsParameters,
                },
                callback
              );
            }
          );

          // Получение медиа с устройства пользователя
          const localStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          });
          setStream(localStream);

          // Отправка аудио
          const audioTrack = localStream.getAudioTracks()[0];
          if (audioTrack) {
            sendTransportRef.current.produce({ track: audioTrack });
          }
          // Отправка видео (если нужно)
          // const videoTrack = localStream.getVideoTracks()[0];
          // if (videoTrack) {
          //   sendTransportRef.current.produce({ track: videoTrack });
          // }
        }
      );
    });

    // Слушаем новых продюсеров (других пользователей)
    socketRef.current.on("new-producer", async ({ producerId, kind }) => {
      if (kind !== "audio") return; // если нужен только звук

      // Создаём транспорт для приёма, если ещё не создан
      if (!recvTransportRef.current) {
        socketRef.current.emit(
          "create-transport",
          { roomId },
          async ({ transportOptions }: any) => {
            recvTransportRef.current =
              deviceRef.current.createRecvTransport(transportOptions);

            recvTransportRef.current.on(
              "connect",
              ({ dtlsParameters }: any, callback: any) => {
                socketRef.current.emit(
                  "connect-transport",
                  {
                    roomId,
                    transportId: recvTransportRef.current.id,
                    dtlsParameters,
                  },
                  callback
                );
              }
            );

            // После создания транспорта сразу пробуем создать consumer
            consumeAudio(producerId);
          }
        );
      } else {
        consumeAudio(producerId);
      }
    });

    // Функция для создания consumer и добавления трека в remoteStreams
    const consumeAudio = (producerId: string) => {
      socketRef.current.emit(
        "consume",
        {
          roomId,
          producerId,
          rtpCapabilities: deviceRef.current.rtpCapabilities,
        },
        async ({ consumer }) => {
          const newConsumer = await recvTransportRef.current.consume({
            id: consumer.id,
            producerId: consumer.producerId,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters,
          });

          const remoteStream = new MediaStream();
          remoteStream.addTrack(newConsumer.track);

          setRemoteStreams((prev) => [...prev, remoteStream]);
        }
      );
    };

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  return {
    stream, // твой локальный поток (для <video> и <audio>)
    remoteStreams, // массив потоков других пользователей (для <audio>)
  };
};
