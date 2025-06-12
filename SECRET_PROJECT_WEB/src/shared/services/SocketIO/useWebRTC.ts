import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import * as mediasoupClient from "mediasoup-client";
import type { Device } from "mediasoup-client";
import type { ConsumerOptions } from "mediasoup-client/types";

export const useWebRTC = (roomId: string | null) => {
  const socketRef = useRef<Socket>(null);
  const deviceRef = useRef<Device>(null);
  const sendTransportRef = useRef<
    mediasoupClient.types.Transport<mediasoupClient.types.AppData> | undefined
  >(null);
  const recvTransportRef = useRef<
    mediasoupClient.types.Transport<mediasoupClient.types.AppData> | undefined
  >(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_WEBRTC_URL);

    socketRef.current.emit("join-room", { roomId }, async (response: any) => {
      if (response.error) {
        alert(response.error);
        return;
      }

      deviceRef.current = new mediasoupClient.Device();
      await deviceRef.current.load({
        routerRtpCapabilities: response.rtpCapabilities,
      });

      socketRef.current?.emit(
        "create-transport",
        { roomId },
        async ({ transportOptions }: any) => {
          sendTransportRef.current =
            deviceRef.current?.createSendTransport(transportOptions);

          sendTransportRef.current?.on(
            "connect",
            ({ dtlsParameters }: any, callback: any) => {
              socketRef.current?.emit(
                "connect-transport",
                {
                  roomId,
                  transportId: sendTransportRef.current?.id,
                  dtlsParameters,
                },
                callback
              );
            }
          );

          const localStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          setStream(localStream);

          const audioTrack = localStream.getAudioTracks()[0];
          if (audioTrack) {
            const producer = await sendTransportRef.current?.produce({
              track: audioTrack,
            });

            socketRef.current?.emit(
              "produce",
              {
                roomId,
                transportId: sendTransportRef.current?.id,
                kind: producer?.kind,
                rtpParameters: producer?.rtpParameters,
              },
              (response: any) => {
                console.log("Producer registered on server", response);
              }
            );
          }
        }
      );
    });

    socketRef.current.on(
      "new-producer",
      async ({ producerId, kind, peerId }) => {
        if (kind !== "audio") return;
        if (peerId === socketRef.current?.id) return;

        const createRecvTransport = async () => {
          return new Promise((resolve) => {
            socketRef.current?.emit(
              "create-transport",
              { roomId },
              async ({ transportOptions }: any) => {
                recvTransportRef.current =
                  deviceRef.current?.createRecvTransport(transportOptions);

                recvTransportRef.current?.on(
                  "connect",
                  ({ dtlsParameters }: any, callback: any) => {
                    socketRef.current?.emit(
                      "connect-transport",
                      {
                        roomId,
                        transportId: recvTransportRef.current?.id,
                        dtlsParameters,
                      },
                      callback
                    );
                  }
                );

                resolve(true);
              }
            );
          });
        };

        if (!recvTransportRef.current) {
          await createRecvTransport();
        }

        socketRef.current?.emit(
          "consume",
          {
            roomId,
            producerId,
            rtpCapabilities: deviceRef.current?.rtpCapabilities,
          },
          async ({ consumer }: { consumer: ConsumerOptions }) => {
            const newConsumer = await recvTransportRef.current?.consume({
              id: consumer.id,
              producerId: consumer.producerId,
              kind: consumer.kind,
              rtpParameters: consumer.rtpParameters,
            });

            const remoteStream = new MediaStream();
            if (newConsumer?.track) {
              remoteStream.addTrack(newConsumer?.track);
            }
            setRemoteStreams((prev) => [...prev, remoteStream]);
          }
        );
      }
    );

    return () => {
      socketRef.current?.disconnect();
    };
  }, [roomId]);

  return {
    stream,
    remoteStreams,
  };
};
