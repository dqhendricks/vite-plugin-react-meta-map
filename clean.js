const fs = require("fs");
const path = require("path");

// load the tsconfig.json file
const tsconfigPath = path.resolve(__dirname, "tsconfig.json");
const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));

// get the outDir from the tsconfig
const outDir = tsconfig.compilerOptions.outDir || "dist"; // fallback to 'dist' if not set

// resolve the path to the output directory
const distPath = path.resolve(__dirname, outDir);

// delete and recreate the output directory
if (fs.existsSync(distPath)) {
  fs.rmSync(distPath, { recursive: true, force: true });
  fs.mkdirSync(distPath, { recursive: true });
}
