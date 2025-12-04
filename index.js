import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import path from "path";

import authenticate from "./auth.js";
import processCsvFile from "./processCsvFile.js";

const auth = await authenticate();

async function main() {
  const inputFolder = "./inputs";
  const files = fs.readdirSync(inputFolder);

  const csvFiles = files.filter(file => file.endsWith(".csv"));

  for (const file of csvFiles) {
    const filePath = path.join(inputFolder, file);
    try {
      await processCsvFile(filePath, auth.accessToken, auth.apiBaseUrl);
    } catch (err) {
      console.error(`Error processing file ${file}:`, err);
    }
  }

  console.log("All CSV files processed successfully.");
}

main().catch(err => console.error("Fatal error:", err));
