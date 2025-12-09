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

export function createDataitemPayload(dataItem) {
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
    DataItemType: dataItem.type,
    ProductModule: "Implementation Support",
    DetailedDescription: dataItem.name,
    DataPrecision: 2,
  };

  return buildPayload(appData);
}

export function createSecurityGroupPayload(securityGroup) {
  const appData = {
    SecurityGroup: nameSpace + securityGroup.name,
    ProductModule: "Implementation Support",
    SystemGroup: "Integrations",
  };

  return buildPayload(appData);
}

export function createTablePayload(table) {
  const appData = {
    TableSchema: nameSpace + table.name,
    TableSchemaType: "Main",
    SchemaCategory: "Tenant",
    Description: table.name,
    SystemGroup: "Integrations",
    ProductModule: "Integration",
    TableSecurityGroup: nameSpace + table.name,
    Fields: table.fields,
  };

  return buildPayload(appData);
}

export function createAppPayload(app) {
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
    ListFieldSelection: app.appFields,
  };

  return buildPayload(appData);
}

export function createPermissionPayload(permission) {
  let records = [];
  for (const perm of permission) {
    switch (perm.type) {
      case "App":
        records.push({
          Permission: nameSpace + perm.name + " - Apps",
          Description: perm.name,
          ProductModule: "Implementation Support",
          SystemGroup: "Integrations",
          ApplicationSecurityForm: [
            {
              SecurityGroup: nameSpace + perm.name
            }
          ]
        });
        break;
      case "Table":
        records.push({
          Permission: nameSpace + perm.name + " - RUID All",
          Description: perm.name,
          ProductModule: "Implementation Support",
          SystemGroup: "Integrations",
          AccessRules: [
            {
              SecurityGroup: nameSpace + perm.name,
              AllowRead: true,
              AllowDelete: true,
              AllowInsert: true,
              AllowUpdate: true
            }
          ]
        });
        break;
      case "LogicBlock":
        records.push({
          Permission: nameSpace + perm.name + " - Logic Blocks",
          Description: perm.name,
          ProductModule: "Implementation Support",
          SystemGroup: "Integrations",
          ActionSecurityLogicBlocks: [
            {
              SecurityGroup: nameSpace + perm.name,
              AllowFullUpdate: true,
              SkipRowSecurity: true
            }
          ]
        });
        break;
      default:
        throw new Error(`Unsupported permission type: ${perm.type}`);
    }
  }

  return buildMultiRecordPayload(records);
}
