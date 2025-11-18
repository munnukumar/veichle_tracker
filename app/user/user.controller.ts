// app/user/user.controller.ts

import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import createHttpError from "http-errors";

import { createResponse } from "../common/helper/response.helper";
import { createUserTokens } from "../common/services/passport-jwt.service";
import * as userService from "./user.service";
import { IUser } from "./user.dto";

// ---------------------------------------------------------------------
// Create User
// ---------------------------------------------------------------------
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const userData = req.body;
  const newUser = await userService.createUser(userData);

  res.status(201).send(createResponse(newUser, "User created successfully"));
});

// ---------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------
export const login = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as IUser;

  const { password, ...userWithoutPassword } = user;
  const tokens = createUserTokens(userWithoutPassword);

  await userService.updateUser(user._id!, {
    refreshToken: tokens.refreshToken,
  });

  res.send(
    createResponse(
      {
        user: userWithoutPassword,
        tokens,
      },
      "Login successful"
    )
  );
});

// ---------------------------------------------------------------------
// Get User by ID
// ---------------------------------------------------------------------
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.fetchUserById(req.params.id);

  if (!user) throw createHttpError(404, "User not found");

  res.send(createResponse(user, "User fetched successfully"));
});

// ---------------------------------------------------------------------
// Get All Users (Admin Only)
// ---------------------------------------------------------------------
export const getAllUsers = asyncHandler(async (_req, res) => {
  const users = await userService.fetchAllUsers();
  res.send(createResponse(users, "Users fetched successfully"));
});

// ---------------------------------------------------------------------
// User: Update Own Account
// ---------------------------------------------------------------------
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as IUser)._id!;
  const updatedUser = await userService.updateUser(userId, req.body);

  if (!updatedUser) throw createHttpError(404, "User not found");

  res.send(createResponse(updatedUser, "User updated successfully"));
});

// ---------------------------------------------------------------------
// ADMIN: Update User KYC
// ---------------------------------------------------------------------
export const updateUserKYC = asyncHandler(
  async (req: Request, res: Response) => {
    const updatedUser = await userService.updateUserKYC(
      req.params.id,
      req.body
    );

    if (!updatedUser) throw createHttpError(404, "User not found");

    res.send(createResponse(updatedUser, "KYC updated successfully"));
  }
);
