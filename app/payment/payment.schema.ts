import mongoose from "mongoose";
import { Types } from "mongoose";
export interface ITransaction {
    _id: string;

    user: Types.ObjectId;
    project: Types.ObjectId;

    amount: number;

    paymentStatus: "PENDING" | "SUCCESS" | "FAILED";
    transactionId?: string;

    paymentMethod?: string; 
}

const TransactionSchema = new mongoose.Schema<ITransaction>(
    {
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },

        project: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Project", 
            required: true 
        },

        amount: { type: Number, required: true },

        paymentStatus: {
            type: String,
            enum: ["PENDING", "SUCCESS", "FAILED"],
            default: "PENDING",
        },

        transactionId: { type: String },

        paymentMethod: { type: String },
    },
    {
        timestamps: true,
    }
);

export const TransactionModel = mongoose.model<ITransaction>("Transaction", TransactionSchema);
