// // backend/app/docs/swagger.ts
// import swaggerAutogen from "swagger-autogen";

// const doc = {
//   info: {
//     title: "My Project API",
//     description: "Auto-generated Swagger documentation for my project",
//     version: "1.0.0",
//     contact: {
//       name: "API Support",
//       email: "support@example.com",
//     }
//   },
//   host: "localhost:5000", 
//   basePath: "/api",
//   schemes: ["http"],
//   consumes: ["application/json"],
//   produces: ["application/json"],
// };

// const outputFile = `./swagger.json`;
// const endpointsFiles = [
//     // "./app/routes.ts",   
//     "../user/user.route.ts",
// ];

// console.log("Generating Swagger documentation...", endpointsFiles);

// swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc)
//   .then(() => {
//     console.log("✅ Swagger file generated successfully!");
//   })
//   .catch((err) => {
//     console.error("❌ Swagger generation failed:", err);
//   });
