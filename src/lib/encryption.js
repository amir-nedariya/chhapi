import crypto from "crypto";
import bcrypt from "bcryptjs";

// Secret key for AES-256-CBC encryption (32 bytes)
const SECRET = process.env.ENCRYPTION_KEY || process.env.JWT_SECRET || "default_super_secret_key_12345_67890_32bytes";
const KEY = crypto.createHash("sha256").update(SECRET).digest();

/**
 * Symmetrically encrypts a plaintext password using AES-256-CBC.
 * Returns format: "enc:<iv_hex>:<ciphertext_hex>"
 */
export function encryptPassword(text) {
  if (!text) return "";
  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", KEY, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return `enc:${iv.toString("hex")}:${encrypted}`;
  } catch (err) {
    console.error("Encryption error:", err);
    return text;
  }
}

/**
 * Decrypts an encrypted password string ("enc:<iv>:<ciphertext>").
 * If the string is a legacy bcrypt hash or plain string, returns as-is.
 */
export function decryptPassword(encryptedText) {
  if (!encryptedText) return "";
  if (!encryptedText.startsWith("enc:")) {
    // If legacy bcrypt hash, return placeholder or unencrypted text
    return encryptedText;
  }
  try {
    const parts = encryptedText.split(":");
    if (parts.length < 3) return encryptedText;
    const iv = Buffer.from(parts[1], "hex");
    const encrypted = parts[2];
    const decipher = crypto.createDecipheriv("aes-256-cbc", KEY, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error("Decryption error:", err);
    return encryptedText;
  }
}

/**
 * Verifies an input password against stored password (handles both enc: and legacy bcrypt).
 */
export async function verifyPassword(inputPassword, storedPassword) {
  if (!inputPassword || !storedPassword) return false;
  
  if (storedPassword.startsWith("enc:")) {
    const decrypted = decryptPassword(storedPassword);
    return decrypted === inputPassword;
  }

  // Fallback for legacy bcrypt hashed passwords
  if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$")) {
    return await bcrypt.compare(inputPassword, storedPassword);
  }

  // Plaintext fallback comparison
  return storedPassword === inputPassword;
}
