import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../docs/swagger.json";

export const setupSwagger = (app: any) => {
  console.log("swagger lodded");
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
