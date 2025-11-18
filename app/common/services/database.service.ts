import mongoose from "mongoose";

export const connectDB = async () => {
  // console.log("Starting MongoDB connection...", process.env.MONGODB_URI);
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error("MONGO_URI is missing in environment variables!");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...", MONGO_URI);

  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed", err);
    process.exit(1);
  }
};
