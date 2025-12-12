import authenticate from "../auth.js";
import getFiles from "../getFiles.js";
import purgeCsvFile from "./purgeCsvFile.js";

const auth = await authenticate();

async function main() {
  const files = getFiles();
  let hasErrors = false;
  for (const file of files) {
    // this is the unique id that was used to create the records initially
    let nwExternalId = "jnzq4zjrfa";
    try {
      await purgeCsvFile(nwExternalId, auth.accessToken, auth.apiBaseUrl);
    } catch (err) {
      console.error(`Error purging of file ${file}:`, err);
      hasErrors = true;
    }
  }

  if (!hasErrors) {
    console.log("All CSV files purged successfully.");
  }
}

main().catch((err) => console.error("Fatal error:", err));
