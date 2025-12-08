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

//call to write all the permissions in one call, need to change to allow for muliple records at one time
export function createPermissionPayload(permission) {
  const appData = {
    Permission: nameSpace + permission.name + " - App", //TODO: how to handle different permission types
    Description: permission.name,
    ProductModule: "Implementation Support",
    SystemGroup: "Integrations",
    AppSettingSecurity: [
      {
        SecurityGroup: nameSpace + permission.securityGroup,
      },
    ],
  };

  return buildPayload(appData);
}
