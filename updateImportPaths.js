import fs from "fs";
import path from "path";

// Function to recursively process files in a directory
const processDirectory = async (directory) => {
  const files = await fs.promises.readdir(directory, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(directory, file.name);

    if (file.isDirectory()) {
      await processDirectory(fullPath); // Recursively process subdirectories
    } else if (file.isFile() && fullPath.endsWith(".js")) {
      await processFile(fullPath); // Process .js files
    }
  }
};

// Function to modify import paths in a file
const processFile = async (filePath) => {
  const content = await fs.promises.readFile(filePath, "utf8");

  // Regex to find relative import/export paths and add ".js" if missing
  const updatedContent = content.replace(
    /((?:import|export)\s+.*?['"])(\.\/.*?)(['"])/gs, // This handles multiline and single-line imports/exports
    (match, p1, p2, p3) => {
      // Add ".js" to relative paths that don't have any extension
      if (!p2.endsWith(".js") && !path.extname(p2)) {
        return `${p1}${p2}.js${p3}`;
      }
      return match;
    }
  );

  // Save the updated file
  await fs.promises.writeFile(filePath, updatedContent, "utf8");
};

// Main function to run the post-compile step
const main = async () => {
  const outputDir = "./dist"; // Set this to your TypeScript output directory

  try {
    await processDirectory(outputDir);
    console.log("Post-compile process completed successfully.");
  } catch (err) {
    console.error("Error during post-compile process:", err);
  }
};

// Run the script
main();
