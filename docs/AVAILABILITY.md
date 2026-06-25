# High Availability Configuration

## Overview

This document describes the high availability features implemented to achieve **99.5% uptime** for the File Conversion Service.

## Features Implemented

### 1. Health Check Endpoints

The service provides multiple health check endpoints for monitoring and load balancing:

- **`GET /health`** - Basic health check with uptime information
- **`GET /health/live`** - Liveness probe (Kubernetes/Docker compatible)
- **`GET /health/ready`** - Readiness probe (Kubernetes/Docker compatible)
- **`GET /health/detailed`** - Detailed health information including system resources

#### Usage Examples

```bash
# Basic health check
curl http://localhost:3443/health

# Liveness probe
curl http://localhost:3443/health/live

# Readiness probe
curl http://localhost:3443/health/ready

# Detailed health information
curl http://localhost:3443/health/detailed
```

### 2. Graceful Shutdown

The service implements graceful shutdown to:
- Stop accepting new connections
- Allow ongoing requests to complete
- Clean up resources properly
- Prevent data loss during restarts

**Signals Handled:**
- `SIGTERM` - Termination signal (used by process managers)
- `SIGINT` - Interrupt signal (Ctrl+C)
- `uncaughtException` - Unhandled exceptions
- `unhandledRejection` - Unhandled promise rejections

### 3. Process Management with PM2

PM2 (Process Manager 2) provides:
- **Automatic restarts** on crashes
- **Cluster mode** for load distribution
- **Memory monitoring** with automatic restarts
- **Log management**
- **Zero-downtime restarts**

#### Installation

```bash
npm install -g pm2
```

#### Usage

```bash
# Build the project first
npm run build

# Start with PM2
npm run start:pm2

# Or use PM2 directly
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs

# Restart
npm run restart:pm2

# Stop
npm run stop:pm2

# Monitor
pm2 monit
```

#### Configuration

The `ecosystem.config.js` file configures:
- **2 instances** in cluster mode for load balancing
- **500MB memory limit** with automatic restart
- **Automatic restart** on crashes
- **Graceful shutdown** with 5-second timeout
- **Log rotation** and management

### 4. Error Handling

Comprehensive error handling includes:
- **Global error handler** middleware
- **Async error wrapper** for route handlers
- **404 Not Found** handler
- **Structured error responses**
- **Error logging** for monitoring

### 5. Monitoring and Logging

- **Structured logging** with timestamps
- **Error tracking** and reporting
- **Uptime tracking**
- **Resource monitoring** (memory, CPU, disk)
- **Service status checks** (pandoc availability, directory permissions)

## Deployment Recommendations

### For Production (99.5% Uptime)

1. **Use PM2 in Production:**
   ```bash
   npm run build
   npm run start:pm2
   ```

2. **Setup PM2 Startup Script:**
   ```bash
   pm2 startup
   pm2 save
   ```

3. **Configure Load Balancer:**
   - Use health check endpoint: `/health/ready`
   - Configure health check interval: 30 seconds
   - Configure timeout: 5 seconds
   - Configure failure threshold: 3 consecutive failures

4. **Monitor Health Endpoints:**
   - Setup monitoring service (e.g., UptimeRobot, Pingdom)
   - Monitor `/health` endpoint every 1-5 minutes
   - Alert on failures

5. **Resource Monitoring:**
   - Monitor memory usage (restart at 500MB)
   - Monitor CPU usage
   - Monitor disk space
   - Setup alerts for resource exhaustion

6. **Log Management:**
   - Rotate logs regularly
   - Archive old logs (already implemented)
   - Monitor error logs

### Kubernetes Deployment

If deploying to Kubernetes, use:

```yaml
livenessProbe:
  httpGet:
    path: /health/live
    port: 3443
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /health/ready
    port: 3443
  initialDelaySeconds: 10
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3
```

### Docker Deployment

For Docker, use health checks:

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3443/health || exit 1
```

## Uptime Calculation

**99.5% uptime** means:
- **Maximum downtime per month:** ~3.6 hours
- **Maximum downtime per year:** ~43.8 hours

### Achieving 99.5% Uptime

1. **Automatic Restarts:** PM2 automatically restarts crashed processes
2. **Health Monitoring:** Regular health checks detect issues early
3. **Graceful Shutdowns:** Prevents data loss during restarts
4. **Error Handling:** Prevents crashes from unhandled errors
5. **Resource Limits:** Automatic restarts prevent memory leaks
6. **Load Distribution:** Cluster mode distributes load across instances

## Monitoring Checklist

- [ ] Health check endpoint responding
- [ ] PM2 processes running
- [ ] Memory usage within limits
- [ ] Error logs monitored
- [ ] Uptime tracking enabled
- [ ] Automatic restarts working
- [ ] Graceful shutdown tested
- [ ] Load balancer health checks configured

## Troubleshooting

### Service Not Starting

1. Check logs: `pm2 logs` or `npm run dev`
2. Verify dependencies: `npm install`
3. Check port availability: `lsof -i :3443`
4. Verify certificates: Check `cert/` directory

### High Memory Usage

1. Check memory: `pm2 monit`
2. Review logs for memory leaks
3. Adjust `max_memory_restart` in `ecosystem.config.js`
4. Consider reducing cluster instances

### Service Crashes

1. Check error logs: `pm2 logs --err`
2. Review application logs
3. Check system resources
4. Verify health endpoints

## Best Practices

1. **Always use PM2 in production**
2. **Monitor health endpoints regularly**
3. **Setup alerting for failures**
4. **Review logs daily**
5. **Test graceful shutdown procedures**
6. **Keep dependencies updated**
7. **Monitor resource usage**
8. **Setup log rotation**

## Support

For issues or questions about high availability configuration, contact the Converty Team.

