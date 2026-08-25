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
  contactNumber?: string;
  status?: "ACTIVE" | "BLOCKED" | "DELETED";
}
