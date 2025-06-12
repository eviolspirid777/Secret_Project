import {
  Router,
  Transport,
  Producer,
  Consumer,
} from "mediasoup/node/lib/types";
import { Socket } from "socket.io";

export interface Peer {
  id: string;
  socket: Socket;
  transports: Map<string, Transport>;
  producers: Map<string, Producer>;
  consumers: Map<string, Consumer>;
}

export interface Room {
  id: string;
  router: Router;
  peers: Map<string, Peer>;
}

export interface TransportOptions {
  id: string;
  iceParameters: any;
  iceCandidates: any;
  dtlsParameters: any;
  sctpParameters?: any;
}

export interface ProducerOptions {
  id: string;
  kind: "audio" | "video";
  rtpParameters: any;
  appData: any;
}

export interface ConsumerOptions {
  id: string;
  producerId: string;
  kind: "audio" | "video";
  rtpParameters: any;
  appData: any;
}
