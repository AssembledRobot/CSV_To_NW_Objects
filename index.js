import fs from "fs";
import path from "path";

import authenticate from "./auth.js";
import processCsvFile from "./processCsvFile.js";

const auth = await authenticate();

export default function getFiles() {
  const inputFolder = "./inputs";
  const files = fs.readdirSync(inputFolder);

  const csvFiles = files.filter((file) => file.endsWith(".csv"));
  return csvFiles.map((file) => path.join(inputFolder, file));
}

async function main() {
  const files = getFiles();
  for (const file of files) {
    try {
      await processCsvFile(file, auth.accessToken, auth.apiBaseUrl);
    } catch (err) {
      console.error(`Error processing file ${file}:`, err);
    }
  }

  console.log("All CSV files processed successfully.");
}

main().catch((err) => console.error("Fatal error:", err));
