import { Request, Response } from "express";
import { SystemHealth } from "../models";
import os from "os";
import mongoose from "mongoose";

/**
 * Get current system health (Admin only)
 */
export const getSystemHealth = async (req: Request, res: Response) => {
  try {
    // Get latest health record
    const latestHealth = await SystemHealth.findOne().sort({ timestamp: -1 });

    // If no recent health check or older than 5 minutes, create new one
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    if (!latestHealth || latestHealth.timestamp < fiveMinutesAgo) {
      const newHealth = await recordSystemHealth();
      return res.json({
        success: true,
        data: newHealth,
      });
    }

    res.json({
      success: true,
      data: latestHealth,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get system health",
    });
  }
};

/**
 * Record system health metrics
 */
export const recordSystemHealth = async () => {
  try {
    // CPU usage
    const cpus = os.cpus();
    const cpuUsage =
      cpus.reduce((acc, cpu) => {
        const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
        const idle = cpu.times.idle;
        return acc + ((total - idle) / total) * 100;
      }, 0) / cpus.length;

    // Memory usage
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsage = (usedMemory / totalMemory) * 100;

    // Database stats
    const dbStats = await mongoose.connection.db?.stats();
    const activeConnections = mongoose.connections.length;

    // Determine overall status
    let status = "healthy";
    if (cpuUsage > 80 || memoryUsage > 90) {
      status = "degraded";
    }
    if (cpuUsage > 95 || memoryUsage > 95) {
      status = "down";
    }

    const health = await SystemHealth.create({
      timestamp: new Date(),
      status,
      cpuUsage: Number(cpuUsage.toFixed(2)),
      memoryUsage: Number(memoryUsage.toFixed(2)),
      memoryTotal: Math.round(totalMemory / 1024 / 1024), // MB
      memoryUsed: Math.round(usedMemory / 1024 / 1024), // MB
      database: {
        status: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        connections: activeConnections,
        activeConnections,
      },
      application: {
        uptime: process.uptime(),
        activeUsers: 0, // Would need to track this separately
      },
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
    });

    console.log(`📊 Recorded system health: ${status}`);
    return health;
  } catch (error) {
    console.error("Error recording system health:", error);
    throw error;
  }
};

/**
 * Get system health history (Admin only)
 */
export const getHealthHistory = async (req: Request, res: Response) => {
  try {
    const { hours = 24 } = req.query;

    const startTime = new Date();
    startTime.setHours(startTime.getHours() - Number(hours));

    const healthRecords = await SystemHealth.find({
      timestamp: { $gte: startTime },
    }).sort({ timestamp: -1 });

    res.json({
      success: true,
      data: healthRecords,
      count: healthRecords.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get health history",
    });
  }
};

