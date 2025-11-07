import { ProjectionType, QueryOptions } from "mongoose";
import {type IUser} from "./user.dto";
import UserModel from "./user.schema";


export const createUser = async (
    data: Omit<IUser, "_id" | "createdAt" | "updatedAt">
  ) => {
    const result = await UserModel.create(data);
    const { refreshToken, password, ...user } = result.toJSON();
    return user;
  };

export const fetchUserById = async (
    id: string,
    projection?: ProjectionType<IUser>,
    options?: QueryOptions<IUser>
) => {
    const user = await UserModel.findById(id, projection, options);
    return user;
}

export const fetchAllUsers = async (
    projection?: ProjectionType<IUser>,
    options?: QueryOptions<IUser>
) => {
    const users = await UserModel.find({}, projection, options);
    return users;
}

export const updateUser = async (
    id : string,
    data: Partial<IUser>
) => {
    const updatedData = await UserModel.findOneAndUpdate({_id:id}, data, { new: true });
    return updatedData;
}

export const editUser = async (id: string, data: Partial<IUser>) => {
  const result = await UserModel.findOneAndUpdate({ _id: id }, data, {
    new: true,
    select: "-password -refreshToken -facebookId",
  });
  return result;
};

export const getUserByEmail = async (
    email: string,
    projection?: ProjectionType<IUser>
  ) => {
    const result = await UserModel.findOne({ email }, projection).lean();
    return result;
  };

