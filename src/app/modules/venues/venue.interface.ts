export interface ICreateVenue {
  name: string;
  description?: string;
  address: string;
  city: string;
  country: string;
  phone?: string;
  email?: string;
  image?: string;
}

export interface IUpdateVenue {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  image?: string;
  status?: "ACTIVE" | "INACTIVE";
}

export interface IVenueQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
}
