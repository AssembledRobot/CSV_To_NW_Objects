import fs from "fs";
import path from "path";
import csv from "csv-parser";
import createNWCall from "./createNWCall.js";

/**
 * Reads the first two rows of a CSV: headers + types
 */
async function readCsvHeaders(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv({ headers: false })) // read raw rows
      .on("data", (row) => {
        rows.push(row);
        if (rows.length === 2) {
          resolve(rows); // only need first two rows
        }
      })
      .on("error", reject);
  });
}

export default async function processCsvFile(
  filePath,
  accessToken,
  apiBaseUrl,
) {
  const rows = await readCsvHeaders(filePath);
  const headersRow = Object.values(rows[0]);
  const typesRow = Object.values(rows[1]);

  const tableName = path.parse(filePath).name;
  const fields = [];
  const nameSpace = "nsTs";

  console.log(`Processing CSV file: ${filePath}`);

  for (let i = 0; i < headersRow.length; i++) {
    const headerName = headersRow[i];
    const dataType = typesRow[i];

    const dataItem = {
      name: headerName,
      type: dataType,
    };
    await createNWCall(accessToken, apiBaseUrl, "DataItems", dataItem);

    // store fields so that they can be passed to the table and app creation
    fields.push({ Field: nameSpace + headerName });
  }
  
  const table = {
    name: tableName,
    fields,
  };
  await createNWCall(accessToken, apiBaseUrl, "TableSchemas", table);

  const app = {
    name: tableName,
    tableSchema: nameSpace + tableName,
  };
  await createNWCall(accessToken, apiBaseUrl, "Applications", app);
}
