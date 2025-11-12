import { BaseSchema } from "../common/dto/base.dto";

export interface IProject extends BaseSchema {
    _id: string;
    title: string;
    description: string;
    price: number;
    thumbnail?: string;
    files?: string[];
    category?: string;

    createdBy: string; // Admin ID
    isActive: boolean;
}
