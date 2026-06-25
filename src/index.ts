import express from "express";
import bodyParser from "body-parser";
import https from "https";
import http from "http";
import fs from "fs";
import path from "path";
import helmet from "helmet";

import uploadRoute from "./routes/uploadRoute";
import convertCsvRoute from "./routes/convertCsv";
import convertMdRoute from "./routes/convertMd";
import docsRoute from "./routes/docs";
import healthRoute from "./routes/health";
import { archiveOldLogs } from "./logger";
import { generateSelfSignedCert } from "./utils/generateCert";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { setupGracefulShutdown, registerServer } from "./utils/gracefulShutdown";

// ...after all imports, before app.listen:
archiveOldLogs();

// Setup graceful shutdown handlers
setupGracefulShutdown();

const app = express(); // ✅ Declare before using it anywhere

// 🛡️ Apply middlewares
app.use(helmet());
app.use(express.json());
app.use(bodyParser.json());

// 🛠️ Routes
app.use("/", uploadRoute);
app.use("/", convertCsvRoute);
app.use("/", convertMdRoute);
app.use("/api-docs", docsRoute); // API Documentation
app.use("/", healthRoute); // Health check endpoints

// Error handling (must be after all routes)
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = 3443;
const CERT_DIR = "cert";
const KEY_PATH = path.join(CERT_DIR, "key.pem");
const CERT_PATH = path.join(CERT_DIR, "cert.pem");

// 🗂️ SSL certificate setup
function startServer(): void {
  // Check if certificates exist
  const certsExist = fs.existsSync(KEY_PATH) && fs.existsSync(CERT_PATH);

  if (certsExist) {
    try {
      // ✅ Start secure HTTPS server
      const sslOptions = {
        key: fs.readFileSync(KEY_PATH),
        cert: fs.readFileSync(CERT_PATH),
      };

      const httpsServer = https.createServer(sslOptions, app);
      registerServer(httpsServer);
      
      httpsServer.listen(PORT, () => {
        console.log(`🔐 Secure server running on https://localhost:${PORT}`);
        console.log(`📊 Health check: https://localhost:${PORT}/health`);
        console.log(`📚 API docs: https://localhost:${PORT}/api-docs`);
      });
    } catch (error) {
      console.error("❌ Error reading SSL certificates:", error);
      console.log("🔄 Falling back to HTTP...");
      startHttpServer();
    }
  } else {
    console.log("⚠️  SSL certificates not found. Attempting to generate...");
    try {
      generateSelfSignedCert();
      // Retry with generated certificates
      const sslOptions = {
        key: fs.readFileSync(KEY_PATH),
        cert: fs.readFileSync(CERT_PATH),
      };
      const httpsServer = https.createServer(sslOptions, app);
      registerServer(httpsServer);
      
      httpsServer.listen(PORT, () => {
        console.log(`🔐 Secure server running on https://localhost:${PORT}`);
        console.log(`📊 Health check: https://localhost:${PORT}/health`);
        console.log(`📚 API docs: https://localhost:${PORT}/api-docs`);
      });
    } catch (error) {
      console.error("❌ Failed to generate SSL certificates:", error);
      console.log("🔄 Falling back to HTTP server...");
      startHttpServer();
    }
  }
}

function startHttpServer(): void {
  const httpServer = http.createServer(app);
  registerServer(httpServer);
  
  httpServer.listen(PORT, () => {
    console.log(`⚠️  HTTP server running on http://localhost:${PORT} (not secure)`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 API docs: http://localhost:${PORT}/api-docs`);
    console.log("💡 To use HTTPS, generate certificates with: npm run generate-cert");
  });
}

startServer();
