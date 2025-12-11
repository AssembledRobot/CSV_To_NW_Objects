import path from "path";
import createNWCall from "./createNWCall.js";
import readCsvHeaders from "./readCsvHeaders.js";

const createDataItem = true;
const createSecurityGroup = true;
const createTable = true;
const createApp = true;
const createPermission = true;
const createRole = true;

const nwExternalId = Math.random().toString(36).substring(2, 12);

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
  const createdPermission = [];

  console.log(`Processing CSV file: ${filePath}, External ID: ${nwExternalId}`);

  // Seperate calls for each data item because it allows partial success
  for (let i = 0; i < headersRow.length; i++) {
    const headerName = headersRow[i];
    const dataType = typesRow[i];

    if (createDataItem) {
      const dataItem = {
        name: headerName,
        type: "DataItems",
        nwExternalId: nwExternalId,
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
      nwExternalId: nwExternalId,
    };
    await createNWCall(accessToken, apiBaseUrl, securityGroup);
  }

  if (createTable) {
    const table = {
      name: tableName,
      type: "TableSchemas",
      fields: fields,
      nwExternalId: nwExternalId,
    };
    await createNWCall(accessToken, apiBaseUrl, table);
  }

  if (createApp) {
    const app = {
      name: tableName,
      type: "Applications",
      nwExternalId: nwExternalId,
      fields: fields,
    };
    await createNWCall(accessToken, apiBaseUrl, app);
  }

  if (createPermission) {
    let permission = {
      name: tableName,
      type: "Permissions",
      nwExternalId: nwExternalId,
      permissionType: ["App", "Table", "LogicBlock"],
    };

    const permissionCall = await createNWCall(
      accessToken,
      apiBaseUrl,
      permission
    );

    if (permissionCall) {
      for (const record of permissionCall.Data.records) {
        createdPermission.push(record.appData.Permission);
      }
    }
  }

  if (createRole) {
    let role = {
      name: tableName,
      type: "Roles",
      nwExternalId: nwExternalId,
      roleType: ["Duty", "Functional"],
      createdPermission: createdPermission, // if there were permissions created, add them to the duty role
    };
    await createNWCall(accessToken, apiBaseUrl, role);
  }
}
