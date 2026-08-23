export interface ICreateTimeSlot {
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface IUpdateTimeSlot {
  date?: string;
  startTime?: string;
  endTime?: string;
}
