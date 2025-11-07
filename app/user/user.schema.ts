import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { IUser } from "./user.dto"

const UserSchema = new mongoose.Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ["ADMIN","USER"],
            default: "USER",
        },
        isBlocked: { type: Boolean, default: false },
        image: { type: String },
        isEmailVerified: { type: Boolean, default: false },
        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: String },
        refreshToken: { type: String, required: false, default: "", select: false },
    },
    {
        timestamps: true,
    }
);

export const hashPassword = async (password: string) => {
    const hash = await bcrypt.hash(password, 12);
    return hash;
  };

  UserSchema.pre("save", async function (next) {
    if (this.password) {
      this.password = await hashPassword(this.password);
    }
    next();
  });
  
  export default mongoose.model<IUser>("user", UserSchema);