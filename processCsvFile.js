import path from "path";
import authenticate from "./auth.js";
import createNWCall from "./createNWCall.js";
import readCsvHeaders from "./readCsvHeaders.js";

const nwExternalId = Math.random().toString(36).substring(2, 12);

async function createDataItemConfigs(csvBuffer) {
  const rows = await readCsvHeaders(csvBuffer);
  const headersRow = Object.values(rows[0]);
  const typesRow = Object.values(rows[1]);
  const dataItemConfigs = [];

  for (let i = 0; i < headersRow.length; i++) {
    const dataItemName = headersRow[i];
    const dataItemType = typesRow[i];

    const config = {
      on: true,
      name: dataItemName,
      type: "DataItems",
      httpMethod: "post",
      dataItemType: dataItemType,
    };
    dataItemConfigs.push(config);
  }
  return dataItemConfigs;
}

export default async function processCsvFile(csvBuffer) {
  const auth = await authenticate();
  const accessToken = auth.accessToken;
  const apiBaseUrl = auth.apiBaseUrl;

  const configs = await createDataItemConfigs(csvBuffer);
  const fields = configs.map(config => ({ Field: config.name }));
  const tableName = "ImportedData";

  let createdPermissions = [];
  let createdRoles = [];

  console.log(`Processing CSV, External ID: ${nwExternalId}`);

  // add all other entity configs
  configs.push(
    {
      on: true,
      name: tableName,
      type: "SecurityGroups",
      httpMethod: "post",
    },
    {
      on: true,
      name: tableName,
      type: "TableSchemas",
      httpMethod: "post",
      fields: fields
    },
    {
      on: true,
      name: tableName,
      type: "Applications",
      httpMethod: "post",
      fields: fields
    },
    {
      on: true,
      name: tableName,
      type: "Permissions",
      httpMethod: "post",
      permissionType: ["App", "Table", "LogicBlock"]
    },
    {
      on: true,
      name: tableName,
      type: "Roles",
      httpMethod: "post",
      roleType: ["Duty", "Functional"],
    },
    // {
    //   on: true,
    //   name: tableName,
    //   type: "Users",
    //   httpMethod: "put",
    // }
  );

  // Process all entity types in a single loop
  for (const config of configs) {
      if (config.on) {

        config.nwExternalId = nwExternalId;

        if (config.type === "Roles") {
          config.createdPermissions = createdPermissions;
        }

        if (config.type === "Users") {
          config.createdRoles = createdRoles;
          const fetchUser = await createNWCall(accessToken, apiBaseUrl, config) // needs to fetch existing user
          config.appData = fetchUser.Data.records[0] //TODO: figure out how to pass whole object to update call
        }
        const response = await createNWCall(accessToken, apiBaseUrl, config);

      // Capture created permissions if this was the permission creation step
      if (config.type === "Permissions" && response) {
        for (const record of response.Data.records) {
          createdPermissions.push(record.appData.Permission);
        }
      }

      // Capture created roles if this was the role creation step
      if (config.type === "Roles" && response) {
        for (const record of response.Data.records) {
          createdRoles.push(record.appData.Role);
        }
      }
    } 
  }
}
