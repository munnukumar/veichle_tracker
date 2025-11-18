// app/user/user.dto.ts
export enum KycStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
}

export interface IKycDetails {
  documentType: string;
  documentNumber?: string;
  frontImage?: string;
  backImage?: string;
  status: KycStatus;
  rejectionReason?: string;
  submittedAt?: Date;
  verifiedAt?: Date;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
  isBlocked: boolean;
  kyc?: IKycDetails;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserCreateDTO {
  name: string;
  email: string;
  password: string;
}

export interface IUserLoginDTO {
  email: string;
  password: string;
}

export interface IUserUpdateDTO {
  name?: string;
  email?: string;
  password?: string;
}

export interface IJwtPayload {
  _id: string;
  role: "USER" | "ADMIN";
}
