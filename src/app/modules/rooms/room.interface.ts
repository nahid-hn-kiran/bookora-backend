import { RoomStatus } from "../../../generated/prisma/enums";

export interface ICreateRoom {
  name: string;
  description?: string;
  capacity: number;
  price: number;
  duration: number;
  difficulty?: string;
  image?: string;
  status?: RoomStatus;
  venueId: string;
}

export interface IUpdateRoom {
  name?: string;
  description?: string;
  capacity?: number;
  price?: number;
  duration?: number;
  difficulty?: string;
  image?: string;
  status?: RoomStatus;
}
