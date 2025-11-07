import express, { Request, Response } from "express";
import { setupSwagger } from "./app/config/swagger.config";
import cors from "cors";
import { connectDB } from "./app/common/services/database.service";
import { redisClient } from "./app/common/services/redis.service";
import routes from "./app/routes";
import { loadConfig } from "./app/common/helper/config.helper"; 
import  { initPassport } from "./app/common/services/passport-jwt.service";


loadConfig();
// dotenv.config({ path: ".env" });

const app = express();
initPassport();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", routes);

// app.get("/", (req: Request, res: Response) => {
//   res.send("FreelanceHub API is running...");
// });

setupSwagger(app);

// Connect DB & Redis, then start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
      await connectDB(); // connect MongoDB
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