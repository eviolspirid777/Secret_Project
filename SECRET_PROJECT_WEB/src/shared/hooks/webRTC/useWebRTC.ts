import * as mediasoupClient from "mediasoup-client";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type {
  ConsumerOptions,
  RtpCapabilities,
  TransportOptions,
} from "mediasoup-client/types";

export const useWebRTC = (roomId: string | null, isConnectToCall: boolean) => {
  const userId = localStorageService.getUserId();

  const usersInSession = useRef<string[]>([]);

  const streamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<Socket>(null);
  const deviceRef = useRef<mediasoupClient.types.Device>(null);

  const producerRef =
    useRef<mediasoupClient.types.Transport<mediasoupClient.types.AppData>>(
      null
    );
  const consumerRef =
    useRef<mediasoupClient.types.Transport<mediasoupClient.types.AppData>>(
      null
    );

  const remoteStreamRef = useRef<MediaStream>(null);
  const [streamTrack, setStreamTrack] = useState<MediaStreamTrack>();

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_WEBRTC_URL);
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const handleJoinRoomCallback = (
    users: string[],
    rtpCapabilities: RtpCapabilities
  ) => {
    deviceRef.current?.load({ routerRtpCapabilities: rtpCapabilities });
    handleCreateRtcSendTransport(roomId!, userId!);
    if (users.length > 1) {
      handleCreateRtcReceiveTransport(roomId!, userId!);
    }
  };

  const handleCreateRtcSendTransport = (roomId: string, userId: string) => {
    socketRef.current?.emit(
      "create-send-transport",
      roomId,
      userId,
      handleSetSendTransportOptions
    );
  };

  const handleSetSendTransportOptions = async (
    transportOptions: TransportOptions
  ) => {
    const sendTransport =
      deviceRef.current?.createSendTransport(transportOptions);

    producerRef.current = sendTransport!;

    sendTransport?.on("connect", async (transport, callback) => {
      socketRef.current?.emit(
        "connect-transport",
        {
          roomId,
          userId,
          transportId: sendTransport.id,
          dtlsParameters: transport.dtlsParameters,
        },
        () => {
          console.log("sendTransport connected");
          callback();
        }
      );
      console.log("sendTransport connected");
    });

    sendTransport?.on("connectionstatechange", async (state) => {
      console.log("sendTransport connectionstatechange", state);
    });

    sendTransport?.on(
      "produce",
      ({ appData, kind, rtpParameters }, callback) => {
        socketRef.current?.emit(
          "produce",
          {
            appData,
            kind,
            rtpParameters,
            roomId,
            userId,
            sendTransportId: sendTransport.id,
          },
          (producerId: string) => {
            handleAlarmUserAboutNewProducer(roomId!, userId!);
            callback({ id: producerId });
          }
        );
      }
    );

    const audioTrack = streamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      await sendTransport?.produce({ track: audioTrack });
    }
  };

  const handleAlarmUserAboutNewProducer = (roomId: string, userId: string) => {
    socketRef.current?.emit("new-producer-created", roomId, userId);
  };

  const handleCreateRtcReceiveTransport = (roomId: string, userId: string) => {
    //TODO: ВЫБРАСЫВАЕТ ДРУГОГО ПОЛЬЗОВАТЕЛЯ КАКОГО-ТО ХРЕНА!! И ЕГО ПРОДЮС И КОСЬЮМ ПАДАЮТ...
    console.group("create-recieve-transport");
    console.log(roomId);
    console.log(userId);
    console.groupEnd();
    socketRef.current?.emit(
      "create-recieve-transport",
      roomId,
      userId,
      handleSetRecvTransportOptions
    );
  };

  const handleSetRecvTransportOptions = (
    transportOptions: TransportOptions
  ) => {
    const recieveTransport =
      deviceRef.current?.createRecvTransport(transportOptions);

    consumerRef.current = recieveTransport!;

    recieveTransport?.on("connect", async ({ dtlsParameters }, callback) => {
      socketRef.current?.emit(
        "connect-transport",
        { userId, transportId: recieveTransport.id, dtlsParameters },
        callback
      );
    });

    recieveTransport?.on("connectionstatechange", (state) => {
      console.log("receiveTransport connectionstatechange", state);
    });

    socketRef.current?.emit(
      "consume",
      {
        roomId,
        userId,
        rtpCapabilities: deviceRef.current?.rtpCapabilities,
        transportId: recieveTransport?.id,
      },
      async (consumerOptions: ConsumerOptions) => {
        try {
          console.group("CONSUMER_OPTIONS");
          console.log(consumerOptions);
          console.groupEnd();
          const consumer = await recieveTransport?.consume({
            id: consumerOptions.id,
            producerId: consumerOptions.producerId,
            rtpParameters: consumerOptions.rtpParameters,
            appData: consumerOptions.appData,
            kind: consumerOptions.kind,
          });

          console.log("CONSUMER_TRACK");
          console.log(consumer?.track);
          console.log("CONSUMER_TRACK");
          remoteStreamRef.current = new MediaStream();
          remoteStreamRef.current.addTrack(consumer!.track);
          setStreamTrack(consumer?.track);
        } catch (ex) {
          console.log(ex);
        }
      }
    );
  };

  const handleUserDisconnected = async (users: string[]) => {
    usersInSession.current = users;
  };

  useEffect(() => {
    if (!roomId || !isConnectToCall) return;

    (async () => {
      try {
        deviceRef.current = await mediasoupClient.Device.factory();
        const localStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        streamRef.current = localStream;

        socketRef.current?.emit(
          "join-room",
          { userId, roomId },
          handleJoinRoomCallback
        );
      } catch (err) {
        console.error(err);
      }
    })();

    socketRef.current?.on("new-producer", async (producerId) => {
      console.log("new-producer-id", producerId);
      handleCreateRtcReceiveTransport(roomId, userId!);
    });

    socketRef.current?.on("user-disconnected", handleUserDisconnected);
  }, [roomId, isConnectToCall]);

  return {
    socketRef,
    streamRef,
    remoteStreamRef,
    streamTrack,
  };
};
