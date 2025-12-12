import getFiles from "./getFiles.js";
import processCsvFile from "./processCsvFile.js";

async function main() {
  const filePaths = getFiles();
  let hasErrors = false;
  for (const filePath of filePaths) {
    try {
      await processCsvFile(filePath);
    } catch (err) {
      console.error(`Error processing file ${filePath}:`, err);
      hasErrors = true;
    }
  }

  if (!hasErrors) {
    console.log("All CSV files processed successfully.");
  }
}

main().catch((err) => console.error("Fatal error:", err));
