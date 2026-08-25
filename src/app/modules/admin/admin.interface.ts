export interface IUpdateAdminPayload {
  admin?: {
    name?: string;
    profilePhoto?: string;
    contactNumber?: string;
  };
}

export interface IUpdateUserPayload {
  name?: string;
  profilePhoto?: string;
  status?: "ACTIVE" | "BLOCKED" | "DELETED";
}

export interface IGetUsersQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: "ACTIVE" | "BLOCKED" | "DELETED";
}
