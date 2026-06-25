import { Server } from "http";
import { Server as HttpsServer } from "https";

let server: Server | HttpsServer | null = null;
let isShuttingDown = false;

/**
 * Register the server instance for graceful shutdown
 */
export function registerServer(srv: Server | HttpsServer): void {
  server = srv;
}

/**
 * Graceful shutdown handler
 */
export function gracefulShutdown(signal: string): void {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  if (!server) {
    console.log("❌ No server instance found");
    process.exit(1);
  }

  // Stop accepting new connections
  server.close(() => {
    console.log("✅ HTTP server closed");
    
    // Give ongoing requests time to complete (max 10 seconds)
    setTimeout(() => {
      console.log("✅ Graceful shutdown complete");
      process.exit(0);
    }, 10000);
  });

  // Force shutdown after 15 seconds if graceful shutdown fails
  setTimeout(() => {
    console.error("⚠️  Forced shutdown after timeout");
    process.exit(1);
  }, 15000);
}

/**
 * Setup graceful shutdown handlers
 */
export function setupGracefulShutdown(): void {
  // Handle termination signals
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  // Handle uncaught exceptions
  process.on("uncaughtException", (error: Error) => {
    console.error("❌ Uncaught Exception:", error);
    gracefulShutdown("uncaughtException");
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (reason: any, promise: Promise<any>) => {
    console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
    gracefulShutdown("unhandledRejection");
  });

  console.log("✅ Graceful shutdown handlers registered");
}

