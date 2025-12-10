/**
 * Encryption Utilities
 * AES-256-GCM encryption for sensitive data
 */

import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

// Validate encryption key on startup
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
  console.error("❌ FATAL: ENCRYPTION_KEY must be exactly 32 characters");
  console.error("Generate one with: openssl rand -hex 32");
  process.exit(1);
}

/**
 * Encrypt sensitive text data
 * @param text - Plain text to encrypt
 * @returns Encrypted string in format: iv:authTag:encrypted
 */
export function encrypt(text: string): string {
  if (!text) return "";

  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY),
      iv
    );

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag();

    // Format: iv:authTag:encrypted
    return (
      iv.toString("hex") + ":" + authTag.toString("hex") + ":" + encrypted
    );
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt data");
  }
}

/**
 * Decrypt encrypted text data
 * @param encryptedData - Encrypted string in format: iv:authTag:encrypted
 * @returns Decrypted plain text
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData) return "";

  try {
    const parts = encryptedData.split(":");
    if (parts.length !== 3) {
      throw new Error("Invalid encrypted data format");
    }

    const iv = Buffer.from(parts[0], "hex");
    const authTag = Buffer.from(parts[1], "hex");
    const encrypted = parts[2];

    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY),
      iv
    );

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt data");
  }
}

/**
 * Mask sensitive data for display (show only last 4 characters)
 * @param data - Sensitive data to mask
 * @param visibleChars - Number of characters to show (default: 4)
 * @returns Masked string like "****1234"
 */
export function maskSensitiveData(data: string, visibleChars: number = 4): string {
  if (!data || data.length <= visibleChars) return "****";
  
  const visible = data.slice(-visibleChars);
  return "*".repeat(data.length - visibleChars) + visible;
}

/**
 * Hash data (one-way, for comparison only)
 * @param data - Data to hash
 * @returns SHA-256 hash
 */
export function hashData(data: string): string {
  return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * Generate secure random token
 * @param bytes - Number of random bytes (default: 32)
 * @returns Hex string token
 */
export function generateSecureToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

export default {
  encrypt,
  decrypt,
  maskSensitiveData,
  hashData,
  generateSecureToken,
};

