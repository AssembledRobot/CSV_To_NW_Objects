import authenticate from "../auth.js";
import purgeCsvFile from "./purgeCsvFile.js";

const auth = await authenticate();

async function main() {
  // this is the unique id that was used to create the records initially
  let nwExternalId = "1cgixoqqw4";
  let hasErrors = false;
  try {
    await purgeCsvFile(nwExternalId, auth.accessToken, auth.apiBaseUrl);
  } catch (err) {
    console.error(`Error purging external ID: ${nwExternalId}:`, err);
    hasErrors = true;
  }
  if (!hasErrors) {
    console.log("All CSV files purged successfully.");
  }
}

main().catch((err) => console.error("Fatal error:", err));
