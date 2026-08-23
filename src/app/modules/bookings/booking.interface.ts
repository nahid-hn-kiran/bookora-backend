export interface ICreateBooking {
  timeSlotId: string;
  guestCount: number;
  notes?: string;
}

export interface IUpdateBookingStatus {
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
}

export interface ICancelBookingParams {
  bookingId: string;
}
