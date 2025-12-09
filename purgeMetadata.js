import authenticate from "./auth.js";
import getFiles from "./index.js";

const auth = await authenticate();

async function main() {
  const files = getFiles();
  for (const file of files) {
    try {
      console.log(file)
    } catch (err) {
      console.error(`Error processing file ${file}:`, err);
    }
  }

  console.log("All CSV files processed successfully.");
}

main().catch((err) => console.error("Fatal error:", err));
