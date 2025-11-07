// backend/app/docs/swagger.ts
import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "My Project API",
    description: "Auto-generated Swagger documentation for my project",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:5000/api",
      description: "Local development server",
    },
  ],
};

const outputFile = `${__dirname}/swagger.json`; // outputs to backend/app/docs/swagger.json
const endpointsFiles = [
    "./app/routes.ts",      // main routes file
    // "./app/user/user.route.ts",
];

console.log("Generating Swagger documentation...", endpointsFiles);

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc)
  .then(() => {
    console.log("✅ Swagger file generated successfully!");
  })
  .catch((err) => {
    console.error("❌ Swagger generation failed:", err);
  });
