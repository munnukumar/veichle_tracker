// app/user/user.schema.ts

import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, KycStatus } from "./user.dto";   // ✅ FIXED IMPORT

const KycSchema = new Schema({
  documentType: { type: String, enum: ["aadhaar", "passport", "license"] },
  documentNumber: String,
  frontImage: String,
  backImage: String,
  status: {
    type: String,
    enum: Object.values(KycStatus),   // ✅ FIXED ENUM USAGE
    default: KycStatus.PENDING,
  },
  rejectionReason: String,
  submittedAt: Date,
  verifiedAt: Date,
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],   // ❗ FIX: must match IUser
      default: "USER",
    },

    refreshToken: {
      type: String,
      select: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    kyc: { type: KycSchema, default: {} },
  },
  { timestamps: true }
);

// 🔐 Hash Before Save
UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  bcrypt.genSalt(10)
    .then((salt) => bcrypt.hash(this.password, salt))
    .then((hash) => {
      this.password = hash;
      next();
    })
    .catch(next);
});



// 🔐 Compare Password
UserSchema.methods.comparePassword = async function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

// 📌 Index
UserSchema.index({ email: 1 });

const UserModel = model<IUser>("User", UserSchema);
export default UserModel;
