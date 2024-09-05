import { readFileSync, existsSync, rmSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

// Get the current directory (replace __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the tsconfig.json file
const tsconfigPath = path.resolve(__dirname, "tsconfig.json");
const tsconfig = JSON.parse(readFileSync(tsconfigPath, "utf8"));

// Get the outDir from tsconfig
const outDir = tsconfig.compilerOptions.outDir || "dist"; // fallback to 'dist' if not set

// Resolve the path to the output directory
const distPath = path.resolve(__dirname, outDir);

// Delete and recreate the output directory
if (existsSync(distPath)) {
  rmSync(distPath, { recursive: true, force: true });
  mkdirSync(distPath, { recursive: true });
}
