import fs from "fs";
import path from "path";
import csv from "csv-parser";
import insertDataItem from "./insertDataItem.js";
import insertTable from "./insertTable.js";

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

/**
 * Process a CSV file:
 * 1. Insert data items
 * 2. Build table object
 * 3. Call insertTable
 */
export default async function processCsvFile(filePath, accessToken, apiBaseUrl) {
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

    console.log(`Inserting DataItem: ${headerName} (${dataType})`);

    await insertDataItem(accessToken, apiBaseUrl, {
      name: headerName,
      type: dataType
    });

    fields.push({ Field: nameSpace + headerName});
  }

  const table = { name: tableName, fields };
  console.log(`Inserting table: ${tableName}`);
  await insertTable(accessToken, apiBaseUrl, table);
  console.log(`Table ${tableName} inserted successfully.`);
}
