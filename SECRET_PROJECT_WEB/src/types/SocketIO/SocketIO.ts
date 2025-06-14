import * as mediasoupClient from "mediasoup-client";

export type JoinRoomRequest = {
  roomId: string;
  userId: string;
};

export type NewProducer = {
  producerId: string;
  kind: "audio" | "video";
  userId: string;
};

export type CreateTransportRequest = {
  roomId: string;
};

export type CreateSendTransportRequest = {
  roomId: string;
  userId: string;
};

export type CreateReceiveTransportRequest = {
  roomId: string;
  userId: string;
};

export type ConnectTransportRequest = {
  roomId: string;
  userId: string;
  transportId: string;
  dtlsParameters: unknown;
};

export type ProduceRequest = {
  roomId: string;
  userId: string;
  transportId: string;
  kind: "audio" | "video";
  rtpParameters: mediasoupClient.types.RtpParameters;
};

export type ConsumerRequest = {
  roomId: string | null;
  userId: string;
  producerId: string;
  rtpCapabilities: mediasoupClient.types.RtpCapabilities;
  transportId: string;
};
