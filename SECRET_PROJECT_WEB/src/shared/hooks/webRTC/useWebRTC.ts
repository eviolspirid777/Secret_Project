import * as mediasoupClient from "mediasoup-client";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import type { RtpCapabilities, TransportOptions } from "mediasoup-client/types";

export const useWebRTC = (roomId: string | null, isConnectToCall: boolean) => {
  const userId = localStorageService.getUserId();

  const usersInSession = useRef<string[]>([]);

  const streamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<Socket>(null);
  const deviceRef = useRef<mediasoupClient.types.Device>(null);

  const opponentProducerIdRef = useRef<string>(null);

  const producerRef =
    useRef<mediasoupClient.types.Transport<mediasoupClient.types.AppData>>(
      null
    );

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
    usersInSession.current = users;
    deviceRef.current?.load({ routerRtpCapabilities: rtpCapabilities });
    handleCreateRtcSendTransport(roomId!, userId!);
    handleCreateRtcReceiveTransport(roomId!, userId!);
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
          (id: string) => {
            callback({ id });
          }
        );
      }
    );

    const audioTrack = streamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      await sendTransport?.produce({ track: audioTrack });
    }
  };

  const handleCreateRtcReceiveTransport = (roomId: string, userId: string) => {
    socketRef.current?.emit(
      "create-recieve-transport",
      roomId,
      userId,
      handleSetRecvTransportOptions
    );
  };

  const handleSetRecvTransportOptions = (
    transportOptions: TransportOptions,
    producersIds: string[]
  ) => {
    console.log("PRODUCER_IDS");
    console.log(producersIds);
    console.log("END_OF_IDS");
    const recieveTransport =
      deviceRef.current?.createRecvTransport(transportOptions);

    recieveTransport?.on("connect", async ({ dtlsParameters }, callback) => {
      socketRef.current?.emit(
        "connect-transport",
        { roomId, userId, transportId: recieveTransport.id, dtlsParameters },
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
        //TODO: ЗАГЛУШКА НИЖЕ
        //TODO: producerIds не работают
        producerId: opponentProducerIdRef.current,
        rtpCapabilities: deviceRef.current?.rtpCapabilities,
        transportId: recieveTransport?.id,
      },
      async (consumerOptions) => {
        const consumer = await recieveTransport?.consume({
          id: consumerOptions.id,
          producerId: consumerOptions.producerId,
          rtpParameters: consumerOptions.rtp,
          appData: consumerOptions.appData,
        });

        const remoteStream = new MediaStream();
        remoteStream.addTrack(consumer?.track);
      }
    );
  };

  //on
  const handleUserJoined = async (userId: string) => {
    usersInSession.current.push(userId);
  };

  const handleUserDisconnected = async (users: string[]) => {
    usersInSession.current = users;
  };
  //

  useEffect(() => {
    if (!roomId || !isConnectToCall) return;

    (async () => {
      try {
        deviceRef.current = await mediasoupClient.Device.factory();
        const localStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        streamRef.current = localStream;
      } catch (err) {
        console.error(err);
      }
    })();

    //НЕ ПРИХОДИТ ID ДЛЯ ПРОДЮСЕРА...
    socketRef.current?.on("new-producer", async ({ id }: { id: string }) => {
      console.log("id", id);

      opponentProducerIdRef.current = id;
    });

    socketRef.current?.emit(
      "join-room",
      { userId, roomId },
      handleJoinRoomCallback
    );

    socketRef.current?.on("user-joined", handleUserJoined);

    socketRef.current?.on("user-disconnected", handleUserDisconnected);
  }, [roomId, isConnectToCall]);

  return {
    socketRef,
    streamRef,
  };
};
