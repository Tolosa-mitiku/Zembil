/**
 * Environment Variable Validation
 * Ensures all required environment variables are set before starting the server
 */

import { Logger } from './logger';
import * as fs from 'fs';
import * as path from 'path';

interface EnvValidationResult {
  isValid: boolean;
  missing: string[];
  warnings: string[];
}

/**
 * Required environment variables
 */
const REQUIRED_ENV_VARS = [
  'MONGO_URI',
  // FIREBASE_SERVICE_ACCOUNT is optional if firebase-service-account.json exists
  'ENCRYPTION_KEY',
  'SESSION_SECRET',
  'NODE_ENV',
];

/**
 * Recommended but optional environment variables
 */
const RECOMMENDED_ENV_VARS = [
  'ALLOWED_ORIGINS',
  'PAYOUT_MIN_AMOUNT',
  'PLATFORM_FEE_PERCENTAGE',
];

/**
 * Validate environment variables
 */
export const validateEnv = (): EnvValidationResult => {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  // Check recommended variables
  for (const envVar of RECOMMENDED_ENV_VARS) {
    if (!process.env[envVar]) {
      warnings.push(envVar);
    }
  }

  // Validate specific formats
  if (process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length !== 64) {
    missing.push('ENCRYPTION_KEY (must be 64 characters hex)');
  }

  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length < 32) {
    missing.push('SESSION_SECRET (must be at least 32 characters)');
  }

  // Validate Firebase service account (file or environment variable)
  const firebaseServiceAccountPath = path.join(__dirname, '../../firebase-service-account.json');
  const hasFirebaseFile = fs.existsSync(firebaseServiceAccountPath);
  const hasFirebaseEnv = !!process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!hasFirebaseFile && !hasFirebaseEnv) {
    missing.push('FIREBASE_SERVICE_ACCOUNT (or firebase-service-account.json file)');
  } else if (hasFirebaseEnv) {
    // Validate environment variable format if it exists
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);
      const requiredFields = ['project_id', 'private_key', 'client_email'];
      
      for (const field of requiredFields) {
        if (!serviceAccount[field]) {
          missing.push(`FIREBASE_SERVICE_ACCOUNT.${field}`);
        }
      }
    } catch (error) {
      missing.push('FIREBASE_SERVICE_ACCOUNT (invalid JSON)');
    }
  }

  // Validate MongoDB URI format
  if (process.env.MONGO_URI) {
    if (!process.env.MONGO_URI.startsWith('mongodb://') && 
        !process.env.MONGO_URI.startsWith('mongodb+srv://')) {
      missing.push('MONGO_URI (invalid format)');
    }
  }

  const isValid = missing.length === 0;

  return { isValid, missing, warnings };
};

/**
 * Validate and log results
 * Exits process if validation fails in production
 */
export const validateAndLogEnv = (): void => {
  Logger.info('🔍 Validating environment variables...');

  const result = validateEnv();

  if (!result.isValid) {
    Logger.error('❌ Environment validation failed!');
    Logger.error('Missing required variables:', { missing: result.missing });
    
    console.error('\n⚠️  DEPLOYMENT ERROR: Missing Environment Variables\n');
    console.error('The following required environment variables are not set:\n');
    result.missing.forEach((v) => console.error(`   ❌ ${v}`));
    
    console.error('\n📝 How to fix:');
    console.error('   1. Create a .env file in the backend folder');
    console.error('   2. Copy from .env.example');
    console.error('   3. Fill in all required values');
    console.error('   4. For production: Add to Vercel environment variables\n');
    
    console.error('💡 Generate secure keys with: node generate-keys.js\n');

    if (process.env.NODE_ENV === 'production') {
      Logger.error('Exiting due to missing environment variables in production');
      process.exit(1);
    }
  } else {
    Logger.info('✅ All required environment variables are set');
  }

  // Log warnings for recommended variables
  if (result.warnings.length > 0) {
    Logger.warn('⚠️  Optional environment variables not set:', {
      warnings: result.warnings,
    });
    Logger.warn('These are optional but recommended for full functionality');
  }

  // Log environment info
  Logger.info('Environment configuration:', {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    corsOrigins: process.env.ALLOWED_ORIGINS ? 
      process.env.ALLOWED_ORIGINS.split(',').length : 'default',
    rateLimiting: process.env.ENABLE_RATE_LIMITING !== 'false',
    cronJobs: process.env.ENABLE_CRON_JOBS !== 'false',
    encryption: process.env.ENABLE_ENCRYPTION !== 'false',
  });
};

/**
 * Get environment variable with fallback
 */
export const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key];
  
  if (!value) {
    if (fallback !== undefined) {
      Logger.warn(`Environment variable ${key} not set, using fallback`);
      return fallback;
    }
    throw new Error(`Required environment variable ${key} is not set`);
  }
  
  return value;
};

/**
 * Get environment variable as integer
 */
export const getEnvInt = (key: string, fallback?: number): number => {
  const value = process.env[key];
  
  if (!value) {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`Required environment variable ${key} is not set`);
  }
  
  const parsed = parseInt(value, 10);
  
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a valid integer`);
  }
  
  return parsed;
};

/**
 * Get environment variable as boolean
 */
export const getEnvBool = (key: string, fallback: boolean = false): boolean => {
  const value = process.env[key];
  
  if (!value) {
    return fallback;
  }
  
  return value.toLowerCase() === 'true' || value === '1';
};

export default {
  validateEnv,
  validateAndLogEnv,
  getEnv,
  getEnvInt,
  getEnvBool,
};

