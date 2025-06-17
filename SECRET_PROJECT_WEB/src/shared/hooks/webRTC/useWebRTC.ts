import * as mediasoupClient from "mediasoup-client";
import { localStorageService } from "@/shared/services/localStorageService/localStorageService";
import { useEffect, useRef, useState, type RefObject } from "react";
import { io, Socket } from "socket.io-client";
import type {
  AppData,
  ConsumerOptions,
  RtpCapabilities,
  Transport,
  TransportOptions,
} from "mediasoup-client/types";

export const useWebRTC = (
  roomId: string | null,
  isConnectToCall: boolean,
  isScreenShared: boolean,
  screenSharedStreamRef: RefObject<MediaStream | null>
) => {
  const userId = localStorageService.getUserId();

  const usersInSession = useRef<string[]>([]);

  const streamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<Socket>(null);
  const deviceRef = useRef<mediasoupClient.types.Device>(null);

  const producerAudioRef =
    useRef<mediasoupClient.types.Transport<mediasoupClient.types.AppData>>(
      null
    );
  const producerScreenRef = useRef<Transport<AppData>>(null);
  const consumerAudioRef =
    useRef<mediasoupClient.types.Transport<mediasoupClient.types.AppData>>(
      null
    );
  const consumerScreenRef =
    useRef<mediasoupClient.types.Transport<mediasoupClient.types.AppData>>(
      null
    );

  const remoteAudioStreamRef = useRef<MediaStream>(null);
  const remoteScreenStreamRef = useRef<MediaStream>(null);

  const [audioStreamTrack, setAudioStreamTrack] = useState<MediaStreamTrack>();
  const [screenStreamTrack, setScreenStreamTrack] =
    useState<MediaStreamTrack>();

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
    handleCreateRtcSendAudioTransport(roomId!, userId!);
    if (users.length > 1) {
      handleCreateRtcReceiveAudioTransport(roomId!, userId!);
    }
  };

  const handleCreateRtcSendAudioTransport = (
    roomId: string,
    userId: string
  ) => {
    socketRef.current?.emit(
      "create-send-transport",
      roomId,
      userId,
      handleSetSendAudioTransportOptions
    );
  };

  const handleSetSendAudioTransportOptions = async (
    transportOptions: TransportOptions
  ) => {
    const sendAudioTransport =
      deviceRef.current?.createSendTransport(transportOptions);

    producerAudioRef.current = sendAudioTransport!;

    sendAudioTransport?.on("connect", async (transport, callback) => {
      socketRef.current?.emit(
        "connect-transport",
        {
          roomId,
          userId,
          transportId: sendAudioTransport.id,
          dtlsParameters: transport.dtlsParameters,
        },
        () => {
          console.log("sendTransport connected");
          callback();
        }
      );
      console.log("sendTransport connected");
    });

    sendAudioTransport?.on("connectionstatechange", async (state) => {
      console.log("sendTransport connectionstatechange", state);
    });

    sendAudioTransport?.on(
      "produce",
      ({ appData, kind, rtpParameters }, callback) => {
        socketRef.current?.emit(
          "produce-audio",
          {
            appData,
            kind,
            rtpParameters,
            roomId,
            userId,
            sendTransportId: sendAudioTransport.id,
          },
          (producerId: string) => {
            handleAlarmUserAboutNewAudioProducer(roomId!, userId!);
            callback({ id: producerId });
          }
        );
      }
    );

    const audioTrack = streamRef.current?.getAudioTracks()[0];
    if (audioTrack) {
      await sendAudioTransport?.produce({ track: audioTrack });
    }
  };

  const handleCreateRtcSendScreenTransport = (
    roomId: string,
    userId: string
  ) => {
    socketRef.current?.emit(
      "create-send-transport",
      roomId,
      userId,
      handleSetSendScreenTransportOptions
    );
  };

  const handleSetSendScreenTransportOptions = async (
    transportOptions: TransportOptions
  ) => {
    const sendScreenTransport =
      deviceRef.current?.createSendTransport(transportOptions);

    producerScreenRef.current = sendScreenTransport!;

    sendScreenTransport?.on("connect", async (transport, callback) => {
      socketRef.current?.emit(
        "connect-transport",
        {
          roomId,
          userId,
          transportId: sendScreenTransport.id,
          dtlsParameters: transport.dtlsParameters,
        },
        () => {
          console.log("sendTransport connected");
          callback();
        }
      );
      console.log("sendTransport connected");
    });

    sendScreenTransport?.on("connectionstatechange", async (state) => {
      console.log("sendTransport connectionstatechange", state);
    });

    sendScreenTransport?.on(
      "produce",
      ({ appData, rtpParameters }, callback) => {
        socketRef.current?.emit(
          "produce-screen",
          {
            appData,
            kind: "video",
            rtpParameters,
            roomId,
            userId,
            sendTransportId: sendScreenTransport.id,
          },
          (producerId: string) => {
            handleAlarmUserAboutNewScreenProducer(roomId!, userId!);
            callback({ id: producerId });
          }
        );
      }
    );

    const screenSharedTrack = screenSharedStreamRef.current?.getTracks()[0];
    if (screenSharedTrack) {
      await sendScreenTransport?.produce({ track: screenSharedTrack });
    }
  };

  const handleAlarmUserAboutNewAudioProducer = (
    roomId: string,
    userId: string
  ) => {
    socketRef.current?.emit("new-audio-producer-created", roomId, userId);
  };

  const handleAlarmUserAboutNewScreenProducer = (
    roomId: string,
    userId: string
  ) => {
    socketRef.current?.emit("new-screen-producer-created", roomId, userId);
  };

  const handleCreateRtcReceiveAudioTransport = (
    roomId: string,
    userId: string
  ) => {
    console.group("create-recieve-transport");
    console.log(roomId);
    console.log(userId);
    console.groupEnd();
    socketRef.current?.emit(
      "create-recieve-transport",
      roomId,
      userId,
      handleSetRecvAudioTransportOptions
    );
  };

  const handleSetRecvAudioTransportOptions = (
    transportOptions: TransportOptions
  ) => {
    const recieveTransport =
      deviceRef.current?.createRecvTransport(transportOptions);

    consumerAudioRef.current = recieveTransport!;

    recieveTransport?.on("connect", async ({ dtlsParameters }, callback) => {
      socketRef.current?.emit(
        "connect-transport",
        { userId, transportId: recieveTransport.id, dtlsParameters },
        callback
      );
    });

    recieveTransport?.on("connectionstatechange", (state) => {
      console.log("audio-receiveTransport connectionstatechange", state);
    });

    socketRef.current?.emit(
      "consume-audio",
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
          remoteAudioStreamRef.current = new MediaStream();
          remoteAudioStreamRef.current.addTrack(consumer!.track);
          setAudioStreamTrack(consumer?.track);
        } catch (ex) {
          console.log(ex);
        }
      }
    );
  };

  const handleCreateRtcReceiveScreenTransport = (
    roomId: string,
    userId: string
  ) => {
    console.group("create-recieve-transport");
    console.log(roomId);
    console.log(userId);
    console.groupEnd();
    socketRef.current?.emit(
      "create-recieve-transport",
      roomId,
      userId,
      handleSetRecvScreenTransportOptions
    );
  };

  const handleSetRecvScreenTransportOptions = (
    transportOptions: TransportOptions
  ) => {
    const recieveScreenTransport =
      deviceRef.current?.createRecvTransport(transportOptions);

    consumerScreenRef.current = recieveScreenTransport!;

    recieveScreenTransport?.on(
      "connect",
      async ({ dtlsParameters }, callback) => {
        socketRef.current?.emit(
          "connect-transport",
          { userId, transportId: recieveScreenTransport.id, dtlsParameters },
          callback
        );
      }
    );

    recieveScreenTransport?.on("connectionstatechange", (state) => {
      console.log("screen-receiveTransport connectionstatechange", state);
    });

    socketRef.current?.emit(
      "consume-screen",
      {
        roomId,
        userId,
        rtpCapabilities: deviceRef.current?.rtpCapabilities,
        transportId: recieveScreenTransport?.id,
      },
      async (consumerOptions: ConsumerOptions) => {
        try {
          console.group("CONSUMER_OPTIONS");
          console.log(consumerOptions);
          console.groupEnd();
          const consumer = await recieveScreenTransport?.consume({
            id: consumerOptions.id,
            producerId: consumerOptions.producerId,
            rtpParameters: consumerOptions.rtpParameters,
            appData: consumerOptions.appData,
            kind: consumerOptions.kind,
          });

          console.log("CONSUMER_SCREEN_TRACK");
          console.log(consumer?.track);
          console.log("CONSUMER_SCREEN_TRACK");
          remoteScreenStreamRef.current = new MediaStream();
          remoteScreenStreamRef.current.addTrack(consumer!.track);
          setScreenStreamTrack(consumer?.track);
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
        //TODO: Если не подключен микрофон то он не даст присоединиться в комнату? 0.о
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

    socketRef.current?.on("new-audio-producer", async (producerId) => {
      console.log("new-audio-producer-id", producerId);
      handleCreateRtcReceiveAudioTransport(roomId, userId!);
    });

    socketRef.current?.on("new-screen-producer", async (producerId) => {
      console.log("new-screen-producer-id", producerId);
      handleCreateRtcReceiveScreenTransport(roomId, userId!);
    });

    socketRef.current?.on("user-disconnected", handleUserDisconnected);
  }, [roomId, isConnectToCall]);

  useEffect(() => {
    if (!isScreenShared || !screenSharedStreamRef.current) return;

    handleCreateRtcSendScreenTransport(roomId!, userId!);
    //TODO: нужна логика для прекращения стриминга экрана
    //TODO: нужно проверить как работает стриминг экрана
    //TODO: ну соответственно в отдельный ref стримминг экрана привяжи
  }, [isScreenShared]);

  return {
    socketRef,
    streamRef,
    remoteAudioStreamRef,
    remoteScreenStreamRef,
    audioStreamTrack,
    screenStreamTrack,
  };
};
