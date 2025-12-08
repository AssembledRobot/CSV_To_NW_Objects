import fs from "fs";
import path from "path";
import csv from "csv-parser";
import createNWCall from "./createNWCall.js";

const createDataItem = true;
const createSecurityGroup = true;
const createTable = true;
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
  const nameSpace = "nsTs";

  console.log(`Processing CSV file: ${filePath}`);

  for (let i = 0; i < headersRow.length; i++) {
    const headerName = headersRow[i];
    const dataType = typesRow[i];

    const dataItem = {
      name: headerName,
      type: dataType,
    };

    if (createDataItem) {
      await createNWCall(accessToken, apiBaseUrl, "DataItems", dataItem);
    }

    // store fields so that they can be passed to the table and app creation
    fields.push({ Field: nameSpace + headerName });
  }

  if (createSecurityGroup) {
    const securityGroup = {
      name: tableName,
    };
    await createNWCall(
      accessToken,
      apiBaseUrl,
      "SecurityGroups",
      securityGroup
    );
  }

  // this has to happen regardless so that the create app call can reference the table
  const table = {
    name: tableName,
    fields,
  };

  if (createTable) {
    await createNWCall(accessToken, apiBaseUrl, "TableSchemas", table);
  }

  if (createApp) {
    //add the display options to each field
    let appFields = [];
    let sequence = 1;
    for (const f of fields) {
      appFields.push({
        TableSchema: nameSpace + tableName,
        Field: f.Field,
        FieldType: "DataItem",
        nw_seq: sequence,
        FieldStatusDetail: "Ok",
        ListViewDisplayOption: "Primary",
      });
      sequence++;
    }

    const app = {
      name: tableName,
      tableSchema: nameSpace + tableName,
      appFields,
    };
    await createNWCall(accessToken, apiBaseUrl, "Applications", app);
  }

  if (createPermission) {
    const permission = {
      name: tableName,
      securityGroup: tableName,
    };
    // can I make all the permisssion in one call?
    await createNWCall(accessToken, apiBaseUrl, "Permissions", permission);
  }
}
