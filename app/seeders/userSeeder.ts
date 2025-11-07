import mongoose from "mongoose";
import UserModel from "../user/user.schema";
import { connectDB } from "../common/services/database.service";
import { loadConfig } from "../common/helper/config.helper";


loadConfig();


const users = [
    {
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'ADMIN',
        isBlocked: false,
        isEmailVerified: true,
    },
    {
        name: 'User',
        email: 'user@example.com',
        password: 'user123',
        role: 'USER',
        isBlocked: false,
        isEmailVerified: true,
    }
];

const seedUsers = async () => {
    try {
        await connectDB();

        for (const user of users) {
            await UserModel.create(user);
        }

        console.log('Users seeded successfully!');
    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        mongoose.connection.close();
    }
};

seedUsers(); 