import { Request, Response} from "express";
import createHttpError from "http-errors";
import asyncHandler from "express-async-handler";
import { createResponse } from "../common/helper/response.helper";
import { createUserTokens } from "../common/services/passport-jwt.service";
import * as userService from "./user.service";
import {type IUser} from "./user.dto";


export const createUser = asyncHandler(
    async (req: Request, res: Response) => {
        const userData = req.body;
        const newUser = await userService.createUser(userData);
        res.status(201).send(createResponse(newUser, "User created successfully"));
    }
);

export const login = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as IUser;
    const { password, ...userWithoutPassword } = req.user as IUser;;
    const tokens = createUserTokens(userWithoutPassword);
    await userService.editUser(user._id, {
      refreshToken: tokens.refreshToken,
    });
    res.send(createResponse(tokens));
  });

export const getUserById = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.params.id;
        const user = await userService.fetchUserById(userId);
        if (!user) {
            throw createHttpError(404, "User not found");
        }
        res.send(createResponse(user, "User fetched successfully"));
    }
);

export const getAllUsers = asyncHandler(
    async (req: Request, res: Response) => {
        const users = await userService.fetchAllUsers();
        res.send(createResponse(users, "Users fetched successfully"));
    }
);

export const updateUser = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.params.id;
        const updateData = req.body;
        const updatedUser = await userService.updateUser(userId, updateData);
        if (!updatedUser) {
            throw createHttpError(404, "User not found");
        }
        res.send(createResponse(updatedUser, "User updated successfully"));
    }
);