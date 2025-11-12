import { BaseSchema } from "../common/dto/base.dto";

export interface ITransaction extends BaseSchema {
    _id: string;

    user: string;
    project: string;

    amount: number;

    paymentStatus: "PENDING" | "SUCCESS" | "FAILED";
    transactionId?: string;
    paymentMethod?: string;
}
