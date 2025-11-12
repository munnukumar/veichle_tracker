import express, { Request, Response } from "express";
import { loadConfig } from "./app/common/helper/config.helper"; 
loadConfig();
// import { setupSwagger } from "./app/config/swagger.config";
import cors from "cors";
import { connectDB } from "./app/common/services/database.service";
import { redisClient } from "./app/common/services/redis.service";
import routes from "./app/routes";
import  { initPassport } from "./app/common/services/passport-jwt.service";
import { setupSwagger } from './app/config/swagger.config';
import { apiRateLimiter, loginRateLimiter } from './app/config/rateLimiter';
import logger from './app/common/utils/logger';
import path from "path";

// dotenv.config({ path: ".env" });

const app = express();
initPassport();
app.use(cors());
app.use(express.json());

// Apply the general rate limiter for all API routes
app.use('/api', apiRateLimiter);

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")))

// Apply the login rate limiter specifically to the login route
app.use('/api/users/login', loginRateLimiter);

// Swagger Documentation
setupSwagger(app);

// Routes
app.use("/api", routes);

// Global error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
  // Log error
  logger.error(`Error occurred: ${err.message}\nStack: ${err.stack}`);

  // Respond to client
  res.status(500).json({
    message: 'Something went wrong!',
    error: err.message,
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
      await connectDB();
      if (redisClient.status !== "ready") {
        console.log("Waiting for Redis...");
        await new Promise((resolve) => {
          redisClient.once("ready", resolve);
        });
      }
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
      console.error("Failed to start server:", err);
    }
  };
  
  startServer();