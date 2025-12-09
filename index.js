import authenticate from "./auth.js";
import getFiles from "./getFiles.js";
import processCsvFile from "./processCsvFile.js";

const auth = await authenticate();

async function main() {
  const files = getFiles();
  let hasErrors = false;
  for (const file of files) {
    try {
      await processCsvFile(file, auth.accessToken, auth.apiBaseUrl);
    } catch (err) {
      console.error(`Error processing file ${file}:`, err);
      hasErrors = true;
    }
  }

  if (!hasErrors) {
    console.log("All CSV files processed successfully.");
  }
}

main().catch((err) => console.error("Fatal error:", err));
