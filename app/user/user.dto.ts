import { type BaseSchema } from "../common/dto/base.dto";

export interface IUser extends BaseSchema {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: "ADMIN" | "USER";
    isBlocked: boolean;
    image?: string;
    isEmailVerified: boolean;
    resetPasswordToken?: string;
    resetPasswordExpires?: string;
    refreshToken?: string;
}