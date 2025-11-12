// src/common/middleware/upload.middleware.ts

import multer from "multer";
import path from "path";
import fs from "fs";

// Create upload directory if not exists
const uploadPath = path.join(process.cwd(), "uploads/projects");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer Storage Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// Allowed file types
const fileFilter = (req: any, file: any, cb: any) => {
  const allowed = [
    "application/zip",
    "application/x-zip-compressed",
    "application/pdf",
    "image/png",
    "image/jpeg"
  ];

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Invalid file type. Upload zip/pdf/png/jpg only."));
  }

  cb(null, true);
};

export const uploadProjectFiles = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20 MB per file
  }
}).array("files", 10); // ✅ upload up to 10 files
