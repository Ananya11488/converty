import fs from "fs";
import path from "path";

const LOG_FILE = path.join("logs", "conversions.log");
const ARCHIVE_DIR = path.join("logs", "archive");

// ✅ Ensure required folders exist
if (!fs.existsSync("logs")) fs.mkdirSync("logs");
if (!fs.existsSync(ARCHIVE_DIR)) fs.mkdirSync(ARCHIVE_DIR);

// ✅ Write each conversion to the log
export function logConversion(type: string, filename: string): void {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${type} → ${filename}\n`;
  fs.appendFileSync(LOG_FILE, logEntry);
  console.log(`🟢 Logged: ${logEntry.trim()}`);
}

// ✅ Archive current month’s logs and delete archives older than 1 year
export function archiveOldLogs(): void {
  if (!fs.existsSync(LOG_FILE)) return;

  const now = new Date();
  const month = now.toLocaleString("default", { month: "short" });
  const year = now.getFullYear();
  const archiveName = `${month}-${year}.log`;
  const archivePath = path.join(ARCHIVE_DIR, archiveName);

  // Move current log into monthly archive
  fs.renameSync(LOG_FILE, archivePath);
  fs.writeFileSync(LOG_FILE, ""); // Start fresh log file
  console.log(`📦 Archived logs to ${archivePath}`);

  // Delete archives older than 12 months
  const cutoff = new Date(now);
  cutoff.setFullYear(now.getFullYear() - 1);

  fs.readdirSync(ARCHIVE_DIR).forEach((file) => {
    const match = file.match(/([A-Za-z]+)-(\d{4})\.log/);
    if (match && match[2]) {
      const y = match[2];
      const archiveYear = parseInt(y);
      if (archiveYear < cutoff.getFullYear()) {
        fs.unlinkSync(path.join(ARCHIVE_DIR, file));
        console.log(`🗑️ Deleted old archive: ${file}`);
      }
    }
  });
}
