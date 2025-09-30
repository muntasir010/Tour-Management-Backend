import { Types } from "mongoose";

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  GUIDE = "GUIDE",
  SUPER_ADMIN = "SUPER_ADMIN",
}

/**auth provider
 * email, password
 * google authentication
 */

export interface IAuthProviders {
  provider: string;
  providerId: string;
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: string;
  isActive?: IsActive;
  isVerified?: string;

  role: Role;
  auth: IAuthProviders[];
  bookings?: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
