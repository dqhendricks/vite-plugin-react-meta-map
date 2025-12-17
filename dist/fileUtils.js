import fs from "fs";
export function ensureDirExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}
export function writeFile(filePath, content) {
    fs.writeFileSync(filePath, content, "utf8");
}
export function cleanupDir(dirPath) {
    try {
        fs.rmSync(dirPath, { recursive: true, force: true });
    }
    catch (err) {
        console.error(`Failed to delete directory ${dirPath}:`, err);
    }
}
//# sourceMappingURL=fileUtils.js.map