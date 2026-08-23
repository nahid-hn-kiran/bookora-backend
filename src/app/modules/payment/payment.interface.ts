export interface ICreatePaymentIntent {
  bookingId: string;
}

export interface ICreateCheckoutSession {
  bookingId: string;
}

export interface IStripePaymentMetadata {
  bookingId: string;
  userId: string;
}
