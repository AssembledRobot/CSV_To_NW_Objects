const nameSpace = "nsTs";

function buildPayload(appData) {
  const payload = {
    records: [
      {
        appData,
      },
    ],
    createContainer: true,
    commitContainer: true,
  };
  return payload;
}

function buildMultiRecordPayload(recordsArray) {
  const payload = {
    records: recordsArray,
    createContainer: true,
    commitContainer: true,
  };
  return payload;
}

export function createPayload(data) {
  switch (data.type) {
    case "DataItems":
      return createDataitemPayload(data);
    case "SecurityGroups":
      return createSecurityGroupPayload(data);
    case "TableSchemas":
      return createTablePayload(data);
    case "Applications":
      return createAppPayload(data);
    case "Permissions":
      return createPermissionPayload(data);
    case "Roles":
      return createRolePayload(data);
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

function createDataitemPayload(dataItem) {
  const appData = {
    DataItem: nameSpace + dataItem.name,
    Synonyms: [
      {
        Label: dataItem.name,
        HelpText: dataItem.name,
        ShortLabel: dataItem.name,
      },
    ],
    LookupType: "Single",
    SystemGroup: "Integrations",
    DataItemType: dataItem.dataItemType,
    ProductModule: "Implementation Support",
    DetailedDescription: dataItem.name,
    DataPrecision: 2,
  };

  return buildPayload(appData);
}

function createSecurityGroupPayload(securityGroup) {
  const appData = {
    SecurityGroup: nameSpace + securityGroup.name,
    ProductModule: "Implementation Support",
    SystemGroup: "Integrations",
  };

  return buildPayload(appData);
}

function createTablePayload(table) {
  // prepare fields with namespace
  const tableFields = table.fields.map((field) => ({
    Field: nameSpace + field.Field,
  }));

  const appData = {
    TableSchema: nameSpace + table.name,
    TableSchemaType: "Main",
    SchemaCategory: "Tenant",
    Description: table.name,
    SystemGroup: "Integrations",
    ProductModule: "Integration",
    TableSecurityGroup: nameSpace + table.name,
    Fields: tableFields,
  };

  return buildPayload(appData);
}

function createAppPayload(app) {
  // prepare fields with namespace
  const appFields = app.fields.map((field) => ({
    Field: nameSpace + field.Field,
    ListViewDisplayOption: "Primary",
    TableSchema: nameSpace + app.name,
  }));

  const appData = {
    ApplicationName: nameSpace + app.name,
    ApplicationType: "List Only",
    ApplicationStyle: "Standard",
    Description: app.name,
    ProductModule: "Implementation Support",
    SystemGroup: "Integrations",
    ApplicationSecurityGroup: nameSpace + app.name,
    TableSchema: nameSpace + app.name,
    Pages: [
      {
        Page: "nsTsA",
      },
    ],
    ListFieldSelection: appFields,
  };

  return buildPayload(appData);
}

function createPermissionPayload(permission) {
  let records = [];
  for (const type of permission.permissionType) {
    switch (type) {
      case "App":
        records.push({
          appData: {
            Permission: nameSpace + permission.name + " - Apps",
            Description: permission.name,
            ProductModule: "Implementation Support",
            SystemGroup: "Integrations",
            ApplicationSecurityForm: [
              {
                SecurityGroup: nameSpace + permission.name,
              },
            ],
          },
        });
        break;
      case "Table":
        records.push({
          appData: {
            Permission: nameSpace + permission.name + " - RUID All",
            Description: permission.name,
            ProductModule: "Implementation Support",
            SystemGroup: "Integrations",
            AccessRules: [
              {
                SecurityGroup: nameSpace + permission.name,
                AllowRead: true,
                AllowDelete: true,
                AllowInsert: true,
                AllowUpdate: true,
              },
            ],
          },
        });
        break;
      case "LogicBlock":
        records.push({
          appData: {
            Permission: nameSpace + permission.name + " - Logic Blocks",
            Description: permission.name,
            ProductModule: "Implementation Support",
            SystemGroup: "Integrations",
            ActionSecurityLogicBlocks: [
              {
                SecurityGroup: nameSpace + permission.name,
                AllowFullUpdate: true,
                SkipRowSecurity: true,
              },
            ],
          },
        });
        break;
      default:
        throw new Error(`Unsupported permission type: ${type}`);
    }
  }
  return buildMultiRecordPayload(records);
}

function createRolePayload(role) {
  let records = [];
  let permissionsList = [];

  if (
    role.createdPermission !== undefined &&
    role.createdPermission.length > 0
  ) {
    for (const perm of role.createdPermission) {
      permissionsList.push({ Permission: perm });
    }
  }

  for (const type of role.roleType) {
    if (type === "Duty") {
      records.push({
        appData: {
          Role: nameSpace + role.name + "Admin",
          Description: role.name + "Admin",
          ProductModule: "Implementation Support",
          SystemGroup: "Integrations",
          RoleType: "DutyRole",
          PermissionsList: permissionsList,
        },
      });
    } else if (type === "Functional") {
      records.push({
        appData: {
          Role: nameSpace + " - " + role.name + " Admin",
          Description: role.name + "Admin",
          ProductModule: "Implementation Support",
          SystemGroup: "Integrations",
          RoleType: "FunctionalRole",
        },
      });
    }
  }
  return buildMultiRecordPayload(records);
}
