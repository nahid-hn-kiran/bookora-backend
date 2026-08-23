export interface ICreateBooking {
  roomId: string;
  timeSlotId: string;
  bookingDate: string;
  guestCount: number;
  notes?: string;
}

export interface IUpdateBookingStatus {
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
}
