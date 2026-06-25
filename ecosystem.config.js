/**
 * PM2 Ecosystem Configuration
 * Process manager for high availability and automatic restarts
 * 
 * Install PM2: npm install -g pm2
 * Start: pm2 start ecosystem.config.js
 * Stop: pm2 stop ecosystem.config.js
 * Status: pm2 status
 * Logs: pm2 logs
 */

module.exports = {
  apps: [
    {
      name: "file-conversion-service",
      script: "./dist/index.js",
      instances: 2, // Run 2 instances for load balancing
      exec_mode: "cluster", // Cluster mode for load distribution
      watch: false,
      max_memory_restart: "500M", // Restart if memory exceeds 500MB
      env: {
        NODE_ENV: "production",
        PORT: 3443,
      },
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      autorestart: true, // Automatically restart on crash
      max_restarts: 10, // Maximum restarts in 1 minute
      min_uptime: "10s", // Minimum uptime to consider app stable
      restart_delay: 4000, // Wait 4 seconds before restarting
      // Health check configuration
      health_check_grace_period: 3000,
      // Kill timeout for graceful shutdown
      kill_timeout: 5000,
    },
  ],
};

