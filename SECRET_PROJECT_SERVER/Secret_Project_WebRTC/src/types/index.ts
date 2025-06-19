import {
  Router,
  Transport,
  Producer,
  Consumer,
} from "mediasoup/node/lib/types";
import { Socket } from "socket.io";

type producerId = string;
interface ConsumerPeer {
  microphone?: Consumer;
  video?: Consumer;
  screen?: Consumer;
}

export interface ProducerPeer {
  microphone?: Producer[];
  video?: Producer[];
  screen?: Producer[];
}

export interface Peer {
  id: string;
  socket: Socket;
  transports: Transport[];
  producers: ProducerPeer;
  consumers: Map<producerId, ConsumerPeer>;
}

export interface Room {
  id: string;
  router: Router;
  peers: Peer[];
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
