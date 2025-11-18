import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import createError from "http-errors";
import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";
import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";

import { IUser, IJwtPayload } from "../../user/user.dto";
import * as userService from "../../user/user.service";

// ------------------------------------
// 🔐 Password Compare
// ------------------------------------
export const isValidPassword = async (input: string, hashed: string) => {
  return bcrypt.compare(input, hashed);
};

// ------------------------------------
// 🔐 Initialize Passport Strategies
// ------------------------------------
export const initPassport = (): void => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is missing");

  // --------------------------------
  // 🔐 JWT Strategy
  // --------------------------------
  passport.use(
    new JwtStrategy(
      {
        secretOrKey: secret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      async (payload: IJwtPayload, done) => {
        try {
          const user = await userService.fetchUserById(payload._id);

          if (!user) {
            return done(createError(401, "Invalid token user"), false);
          }

          if (user.isBlocked) {
            return done(createError(403, "User is blocked"), false);
          }

          return done(null, user);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  // --------------------------------
  // 🔑 LocalStrategy for Login
  // --------------------------------
  passport.use(
    "login",
    new (LocalStrategy as any)(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email: string, password: string, done: any) => {
        try {
          const user = await userService.getUserByEmail(email, {
            password: true,
            name: true,
            email: true,
            role: true,
            isBlocked: true,
          });

          if (!user) {
            return done(createError(401, "User not found"), false);
          }

          if (user.isBlocked) {
            return done(createError(403, "User is blocked"), false);
          }

          const validPass = await isValidPassword(password, user.password!);

          if (!validPass) {
            return done(createError(401, "Invalid email or password"), false);
          }

          const { password: _p, ...safeUser } = user;
          return done(null, safeUser);
        } catch (err: any) {
          return done(createError(500, err.message), false);
        }
      }
    )
  );
};

// ------------------------------------
// 🔐 Create Access + Refresh Tokens
// ------------------------------------
export const createUserTokens = (user: Omit<IUser, "password">) => {
  const secret: Secret = process.env.JWT_SECRET as Secret;

  const payload: IJwtPayload = {
    _id: user._id,
    role: user.role,
  };

  const accessToken = jwt.sign(payload as jwt.JwtPayload, secret, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY ?? "30m",
  } as SignOptions);

  const refreshToken = jwt.sign(payload as jwt.JwtPayload, secret, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY ?? "2d",
  } as SignOptions);

  return { accessToken, refreshToken };
};

// ------------------------------------
// 🔎 Decode Token (no verify)
// ------------------------------------
export const decodeToken = (token: string) => {
  const decoded = jwt.decode(token) as jwt.JwtPayload;

  if (!decoded) throw createError(400, "Invalid token");

  const expired = dayjs.unix(decoded.exp!).isBefore(dayjs());

  return {
    ...decoded,
    expired,
  };
};

// ------------------------------------
// 🔐 Verify Token (throws if invalid)
// ------------------------------------
export const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET ?? "";
  return jwt.verify(token, secret) as IJwtPayload;
};
