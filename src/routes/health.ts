import express, { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const router = express.Router();

// Track server start time for uptime calculation
const serverStartTime = Date.now();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the service. Use this endpoint for monitoring and load balancer health checks.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 */
router.get("/health", (_req: Request, res: Response) => {
  const uptime = Math.floor((Date.now() - serverStartTime) / 1000);
  
  res.status(200).json({
    status: "healthy",
    uptime: uptime,
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

/**
 * @swagger
 * /health/live:
 *   get:
 *     summary: Liveness probe
 *     description: Kubernetes/Docker liveness probe endpoint. Returns 200 if the service is running.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is alive
 */
router.get("/health/live", (_req: Request, res: Response) => {
  res.status(200).json({ status: "alive" });
});

/**
 * @swagger
 * /health/ready:
 *   get:
 *     summary: Readiness probe
 *     description: Kubernetes/Docker readiness probe endpoint. Checks if the service is ready to accept traffic.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is ready
 *       503:
 *         description: Service is not ready
 */
router.get("/health/ready", async (_req: Request, res: Response) => {
  try {
    // Check if critical directories exist
    const uploadsDir = "uploads";
    const logsDir = "logs";
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    // Check if we can write to uploads directory
    const testFile = path.join(uploadsDir, ".health-check");
    try {
      fs.writeFileSync(testFile, "health-check");
      fs.unlinkSync(testFile);
    } catch (error) {
      return res.status(503).json({
        status: "not ready",
        error: "Cannot write to uploads directory",
      });
    }
    
    return res.status(200).json({
      status: "ready",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(503).json({
      status: "not ready",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * @swagger
 * /health/detailed:
 *   get:
 *     summary: Detailed health check
 *     description: Returns detailed health information including system resources and service status.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Detailed health information
 */
router.get("/health/detailed", async (_req: Request, res: Response) => {
  try {
    const uptime = Math.floor((Date.now() - serverStartTime) / 1000);
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    // Check disk space (if available)
    let diskInfo = null;
    try {
      if (process.platform !== "win32") {
        const { stdout } = await execAsync("df -h . | tail -1");
        diskInfo = stdout.trim();
      }
    } catch {
      // Ignore disk check errors
    }
    
    // Check if pandoc is available (for MD to PDF conversion)
    let pandocAvailable = false;
    try {
      await execAsync("which pandoc");
      pandocAvailable = true;
    } catch {
      pandocAvailable = false;
    }
    
    res.status(200).json({
      status: "healthy",
      uptime: uptime,
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
          external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`,
        },
        cpu: {
          user: `${Math.round(cpuUsage.user / 1000)} ms`,
          system: `${Math.round(cpuUsage.system / 1000)} ms`,
        },
        disk: diskInfo,
      },
      services: {
        pandoc: pandocAvailable,
        uploadsDirectory: fs.existsSync("uploads"),
        logsDirectory: fs.existsSync("logs"),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;

