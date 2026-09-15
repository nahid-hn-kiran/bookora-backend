import { Role, UserStatus } from "../../../generated/prisma/enums";

export interface IRequestUser {
  id: string;
  name?: string;
  email: string;
  role: Role;
  status?: UserStatus;
  isDeleted?: boolean;
}
