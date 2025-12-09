import fs from "fs";
import path from "path";
import csv from "csv-parser";
import createNWCall from "./createNWCall.js";
import { type } from "os";

const createDataItem = false;
const createSecurityGroup = false;
const createTable = false;
const createApp = true;
const createPermission = true;

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
  apiBaseUrl
) {
  const rows = await readCsvHeaders(filePath);
  const headersRow = Object.values(rows[0]);
  const typesRow = Object.values(rows[1]);

  const tableName = path.parse(filePath).name;
  const fields = [];

  console.log(`Processing CSV file: ${filePath}`);

  // Seperate calls for each data item because it allows partial success
  for (let i = 0; i < headersRow.length; i++) {
    const headerName = headersRow[i];
    const dataType = typesRow[i];

    if (createDataItem) {
      const dataItem = {
        name: headerName,
        type: "DataItems",
        dataItemType: dataType,
      };
      await createNWCall(accessToken, apiBaseUrl, dataItem);
    }

    // store fields so that they can be passed to the table and app creation
    fields.push({ Field: headerName });
  }

  if (createSecurityGroup) {
    const securityGroup = {
      name: tableName,
      type: "SecurityGroups",
    };
    await createNWCall(accessToken, apiBaseUrl, securityGroup);
  }

  if (createTable) {
    const table = {
      name: tableName,
      type: "TableSchemas",
      fields: fields,
    };
    await createNWCall(accessToken, apiBaseUrl, table);
  }

  if (createApp) {
    const app = {
      name: tableName,
      type: "Applications",
      fields: fields,
    };
    await createNWCall(accessToken, apiBaseUrl, app);
  }

  if (createPermission) {
    let permission = {
      name: tableName,
      type: "Permissions",
      permissionType: ["App", "Table", "LogicBlock"],
    };
    await createNWCall(accessToken, apiBaseUrl, permission);
  }
}
