import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
// import { config as dotenvConfig } from "dotenv";

// dotenvConfig();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer storage (in memory)
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Middleware to upload image to Cloudinary
export const cloudinaryUpload =  (fieldName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next();

    try {
      const fileBuffer = (req.file as Express.Multer.File).buffer;

      const result = await cloudinary.uploader.upload_stream(
        { folder: "uploads" },
        (error, result) => {
          if (error) return next(error);

          // attach Cloudinary URL to request body
          (req.body as any)[fieldName] = result?.secure_url;
          next();
        }
      );

      // Convert buffer to stream
      const stream = require("stream");
      const bufferStream = new stream.PassThrough();
      bufferStream.end(fileBuffer);
      bufferStream.pipe(result);

    } catch (err) {
      next(err);
    }
  };
};
