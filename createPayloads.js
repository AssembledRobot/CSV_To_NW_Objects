const nameSpace = "nsTs";
const ProductModule = "Implementation Support";
const SystemGroup = "Integrations";

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

// this routes to the correct payload creation function based on the type of data provided
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
    case "User":
      return updateUserPayload(data);
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

function createDataitemPayload(dataItem) {
  const appData = {
    DataItem: nameSpace + dataItem.name,
    nwExternalId: dataItem.nwExternalId,
    Synonyms: [
      {
        Label: dataItem.name,
        HelpText: dataItem.name,
        ShortLabel: dataItem.name,
      },
    ],
    LookupType: "Single",
    ProductModule: ProductModule,
    SystemGroup: SystemGroup,
    DataItemType: dataItem.dataItemType,
    DetailedDescription: dataItem.name,
    DataPrecision: 2,
  };

  return buildPayload(appData);
}

function createSecurityGroupPayload(securityGroup) {
  const appData = {
    SecurityGroup: nameSpace + securityGroup.name,
    nwExternalId: securityGroup.nwExternalId,
    ProductModule: ProductModule,
    SystemGroup: SystemGroup,
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
    nwExternalId: table.nwExternalId,
    TableSchemaType: "Main",
    SchemaCategory: "Tenant",
    Description: table.name,
    ProductModule: ProductModule,
    SystemGroup: SystemGroup,
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
    nwExternalId: app.nwExternalId,
    ApplicationType: "List Only",
    ApplicationStyle: "Standard",
    Description: app.name,
    ProductModule: ProductModule,
    SystemGroup: SystemGroup,
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
            nwExternalId: permission.nwExternalId,
            Description: permission.name,
            ProductModule: ProductModule,
            SystemGroup: SystemGroup,
            ApplicationSecurityForm: [
              {
                SecurityGroup: nameSpace + permission.name,
              },
            ],
          },
        });
        break;
      case "TableR":
        records.push({
          appData: {
            Permission: nameSpace + permission.name + " - Table R",
            nwExternalId: permission.nwExternalId,
            Description: permission.name,
            ProductModule: ProductModule,
            SystemGroup: SystemGroup,
            AccessRules: [
              {
                SecurityGroup: nameSpace + permission.name,
                AllowRead: true,
                AllowDelete: false,
                AllowInsert: false,
                AllowUpdate: false,
              },
            ],
          },
        });
        break;
      case "TableRU":
        records.push({
          appData: {
            Permission: nameSpace + permission.name + " - Table RU",
            nwExternalId: permission.nwExternalId,
            Description: permission.name,
            ProductModule: ProductModule,
            SystemGroup: SystemGroup,
            AccessRules: [
              {
                SecurityGroup: nameSpace + permission.name,
                AllowRead: true,
                AllowDelete: false,
                AllowInsert: false,
                AllowUpdate: true,
              },
            ],
          },
        });
        break;
      case "TableRUI":
        records.push({
          appData: {
            Permission: nameSpace + permission.name + " - Table RUI",
            nwExternalId: permission.nwExternalId,
            Description: permission.name,
            ProductModule: ProductModule,
            SystemGroup: SystemGroup,
            AccessRules: [
              {
                SecurityGroup: nameSpace + permission.name,
                AllowRead: true,
                AllowDelete: false,
                AllowInsert: true,
                AllowUpdate: true,
              },
            ],
          },
        });
        break;
      case "TableRUID":
        records.push({
          appData: {
            Permission: nameSpace + permission.name + " - Table RUID",
            nwExternalId: permission.nwExternalId,
            Description: permission.name,
            ProductModule: ProductModule,
            SystemGroup: SystemGroup,
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
      case "LogicBlocksR":
        records.push({
          appData: {
            Permission: nameSpace + permission.name + " - Logic Blocks R",
            nwExternalId: permission.nwExternalId,
            Description: permission.name,
            ProductModule: ProductModule,
            SystemGroup: SystemGroup,
            ActionSecurityLogicBlocks: [
              {
                SecurityGroup: nameSpace + permission.name,
                AllowFullUpdate: true,
                SkipRowSecurity: false,
              },
            ],
          },
        });
        break;
      case "LogicBlocksRUID":
        records.push({
          appData: {
            Permission: nameSpace + permission.name + " - Logic Blocks RUID",
            nwExternalId: permission.nwExternalId,
            Description: permission.name,
            ProductModule: ProductModule,
            SystemGroup: SystemGroup,
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
    role.createdPermissions !== undefined &&
    role.createdPermissions.length > 0
  ) {
    for (const perm of role.createdPermissions) {
      permissionsList.push({ Permission: perm });
    }
  }

  for (const type of role.roleType) {
    switch (type) {
      case "Viewer":
        records.push({
          appData: {
            Role: nameSpace + " - " + role.name + " Viewer",
            nwExternalId: role.nwExternalId,
            Description: role.name + " Viewer",
            ProductModule: ProductModule,
            SystemGroup: SystemGroup,
            RoleType: "FunctionalRole",
          },
          appData: {
            Role: nameSpace + role.name + "Viewer",
            nwExternalId: role.nwExternalId,
            Description: role.name + "Viewer",
            ProductModule: ProductModule,
            SystemGroup: SystemGroup,
            RoleType: "DutyRole",
            PermissionsList: permissionsList,
          },
        });
        break;
      case "Processor":
        records.push({
          appData: {
            Role: nameSpace + " - " + role.name + " Processor",
            nwExternalId: role.nwExternalId,
            Description: role.name + " Processor",
            ProductModule: ProductModule,
            SystemGroup: SystemGroup,
            RoleType: "FunctionalRole",
            PermissionsList: permissionsList,
          },
          appData: {
            Role: nameSpace + role.name + "Processor",
            nwExternalId: role.nwExternalId,
            Description: role.name + "Processor",
            ProductModule: ProductModule,
            SystemGroup: SystemGroup,
            RoleType: "DutyRole",
            PermissionsList: permissionsList,
          },
        });
        break;
      case "Admin":
        records.push({
          appData: {
            Role: nameSpace + " - " + role.name + " Admin",
            nwExternalId: role.nwExternalId,
            Description: role.name + " Admin",
            ProductModule: ProductModule,
            SystemGroup: SystemGroup,
            RoleType: "FunctionalRole",
          },
          appData: {
            Role: nameSpace + role.name + "Admin",
            nwExternalId: role.nwExternalId,
            Description: role.name + "Admin",
            ProductModule: ProductModule,
            SystemGroup: SystemGroup,
            RoleType: "DutyRole",
            PermissionsList: permissionsList,
          },
        });
        break;
      default:
        throw new Error(`Unsupported role type: ${type}`);
    }
  }
  return buildMultiRecordPayload(records);
}

function updateUserPayload(user) {
  const appData = {
    UserName: user.name,
  };

  return buildPayload(appData);
}
