import authenticate from "./auth.js";
import createNWCall from "./createNWCall.js";
import readCsvHeaders from "./readCsvHeaders.js";

const nwExternalId = Math.random().toString(36).substring(2, 12);

async function createDataItemConfigs(csvBuffer, dataItemsOn) {
  const rows = await readCsvHeaders(csvBuffer);
  const headersRow = Object.values(rows[0]);
  const typesRow = Object.values(rows[1]);
  const dataItemConfigs = [];

  for (let i = 0; i < headersRow.length; i++) {
    const dataItemName = headersRow[i];
    const dataItemType = typesRow[i];

    const config = {
      on: dataItemsOn,
      name: dataItemName,
      type: "DataItems",
      httpMethod: "post",
      dataItemType: dataItemType,
    };
    dataItemConfigs.push(config);
  }
  return dataItemConfigs;
}

async function createPermissionTypes(permissions) {
  const permissionTypes = [];
  if (permissions.permissionApps) {
    permissionTypes.push("App");
  }
  if (permissions.permissionTableR) {
    permissionTypes.push("TableR");
  }
  if (permissions.permissionTableRU) {
    permissionTypes.push("TableRU");
  }
  if (permissions.permissionTableRUI) {
    permissionTypes.push("TableRUI");
  }
  if (permissions.permissionTableRUID) {
    permissionTypes.push("TableRUID");
  }
  if (permissions.permissionLogicBlocksR) {
    permissionTypes.push("LogicBlocksR");
  }
  if (permissions.permissionLogicBlocksRUID) {
    permissionTypes.push("LogicBlocksRUID");
  }
  return permissionTypes;
}

async function createRoleTypes(roles) {
  const roleTypes = [];
  if (roles.roleViewer) {
    roleTypes.push("Viewer");
  }
  if (roles.roleProcessor) {
    roleTypes.push("Processor");
  }
  if (roles.roleAdmin) {
    roleTypes.push("Admin");
  }
  return roleTypes;
}

export default async function processCsvFile(
  csvBuffer,
  tableName,
  checkboxOptions
) {
  const auth = await authenticate();
  const accessToken = auth.accessToken;
  const apiBaseUrl = auth.apiBaseUrl;

  const configs = await createDataItemConfigs(
    csvBuffer,
    checkboxOptions.dataItems
  );

  const permissionTypes = await createPermissionTypes(checkboxOptions.permissions);
  const roleTypes = await createRoleTypes(checkboxOptions.roles);

  const fields = configs.map((config) => ({ Field: config.name }));

  let createdPermissions = [];
  let createdRoles = [];
  const results = [];

  console.log(`Processing CSV: ${tableName}, External ID: ${nwExternalId}`);

  // add all other entity configs
  configs.push(
    {
      on: checkboxOptions.securityGroups,
      name: tableName,
      type: "SecurityGroups",
      httpMethod: "post",
    },
    {
      on: checkboxOptions.tables,
      name: tableName,
      type: "TableSchemas",
      httpMethod: "post",
      fields: fields,
    },
    {
      on: checkboxOptions.applications,
      name: tableName,
      type: "Applications",
      httpMethod: "post",
      fields: fields,
    },
    {
      on: checkboxOptions.permissionsMain,
      name: tableName,
      type: "Permissions",
      httpMethod: "post",
      permissionType: permissionTypes,
    },
    {
      on: checkboxOptions.rolesMain,
      name: tableName,
      type: "Roles",
      httpMethod: "post",
      roleType: roleTypes,
    }
  );

  // Process all entity types in a single loop
  for (const config of configs) {
    if (config.on) {
      config.nwExternalId = nwExternalId;

      if (config.type === "Roles") {
        config.createdPermissions = createdPermissions;
      }

      try {
        const response = await createNWCall(accessToken, apiBaseUrl, config);

        if (response) {
          results.push({
            type: config.type,
            name: config.name,
            status: "success",
          });

          // Capture created permissions if this was the permission creation step
          if (config.type === "Permissions" && response.Data?.records) {
            for (const record of response.Data.records) {
              createdPermissions.push(record.appData.Permission);
            }
          }
        }
      } catch (err) {
        results.push({
          type: config.type,
          name: config.name,
          status: "failed",
        });
      }
    }
  }

  return results;
}
