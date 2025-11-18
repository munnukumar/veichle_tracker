// app/user/user.service.ts

import { IUser, IKycDetails } from "./user.dto";
import UserModel from "./user.schema";
import { ProjectionFields } from "mongoose";
import bcrypt from "bcryptjs";

// -----------------------------------------------------
// Create User
// -----------------------------------------------------
export const createUser = async (
  data: Omit<IUser, "_id" | "createdAt" | "updatedAt">
) => {
  const user = await UserModel.create(data);
  const { password, refreshToken, ...cleanUser } = user.toJSON();
  return cleanUser;
};

// -----------------------------------------------------
// Fetch User by ID
// -----------------------------------------------------
export const fetchUserById = async (id: string) => {
  return UserModel.findById(id).select("-password -refreshToken");
};

// -----------------------------------------------------
// Fetch All Users
// -----------------------------------------------------
export const fetchAllUsers = async () => {
  return UserModel.find().select("-password -refreshToken");
};

// -----------------------------------------------------
// Update Logged-In User (Self Update)
// -----------------------------------------------------
export const updateUser = async (id: string, data: Partial<IUser>) => {
  // If password exists → hash manually (pre-save does NOT run on findByIdAndUpdate)
  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
  }

  return UserModel.findByIdAndUpdate(id, data, {
    new: true,
    select: "-password -refreshToken",
  });
};

// -----------------------------------------------------
// ADMIN: Update User KYC
// -----------------------------------------------------
export const updateUserKYC = async (
  id: string,
  kycData: Partial<IKycDetails>
) => {
  return UserModel.findByIdAndUpdate(
    id,
    { $set: { kyc: kycData } },
    {
      new: true,
      select: "-password -refreshToken",
    }
  );
};

// -----------------------------------------------------
// Get User by Email (with projection)
// -----------------------------------------------------
export const getUserByEmail = async (
  email: string,
  projection: ProjectionFields<IUser> = {}
) => {
  return await UserModel.findOne({ email }, projection).lean();
};
