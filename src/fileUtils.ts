import fs from "fs";

export function ensureDirExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function writeFile(filePath: string, content: string) {
  fs.writeFileSync(filePath, content, "utf8");
}

export function cleanupDir(dirPath: string) {
  try {
    fs.rmSync(dirPath, { recursive: true, force: true });
  } catch (err) {
    console.error(`Failed to delete directory ${dirPath}:`, err);
  }
}
