// backend/app/config/swagger.config.ts
import { Express } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../docs/swagger.json";

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
