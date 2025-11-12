import mongoose, { Schema } from "mongoose";
import { Types } from "mongoose";
export interface IProject {
    _id: string;
    title: string;
    description: string;
    price: number;
    thumbnail?: string;
    files?: string[]; 
    category?: string;

    createdBy: Types.ObjectId;
    isActive: boolean;
}

const ProjectSchema = new mongoose.Schema<IProject>(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },

        price: { type: Number, required: true },

        thumbnail: { type: String },
        files: [{ type: String }],

        category: { type: String },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        isActive: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

export const ProjectModel = mongoose.model<IProject>("Project", ProjectSchema);
