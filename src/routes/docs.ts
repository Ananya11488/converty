import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../config/swagger";

const router = express.Router();

// Serve Swagger UI
router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerSpec, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "File Conversion Service API Documentation",
}));

// Serve Swagger JSON
router.get("/json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

export default router;

