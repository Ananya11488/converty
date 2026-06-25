import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const CERT_DIR = "cert";
const KEY_PATH = path.join(CERT_DIR, "key.pem");
const CERT_PATH = path.join(CERT_DIR, "cert.pem");

/**
 * Generates self-signed SSL certificates for development
 */
export function generateSelfSignedCert(): void {
  // Create cert directory if it doesn't exist
  if (!fs.existsSync(CERT_DIR)) {
    fs.mkdirSync(CERT_DIR, { recursive: true });
  }

  // Check if certificates already exist
  if (fs.existsSync(KEY_PATH) && fs.existsSync(CERT_PATH)) {
    console.log("✅ SSL certificates already exist");
    return;
  }

  console.log("🔐 Generating self-signed SSL certificates for development...");

  try {
    // Generate self-signed certificate using openssl
    // Valid for 365 days, with common name localhost
    const command = `openssl req -x509 -newkey rsa:4096 -keyout "${KEY_PATH}" -out "${CERT_PATH}" -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"`;
    
    execSync(command, { stdio: "inherit" });
    console.log("✅ SSL certificates generated successfully!");
  } catch (error) {
    console.error("❌ Failed to generate SSL certificates:", error);
    throw error;
  }
}

