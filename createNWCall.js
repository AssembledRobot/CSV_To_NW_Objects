import axios from "axios";
const nameSpace = "nsTs";

function createDataitemPayload(dataItem) {
  return {
    records: [
      {
        appData: {
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
        },
      },
    ],
    createContainer: true,
    commitContainer: true,
  };
}

function createTablePayload(table) {
  return {
    records: [
      {
        appData: {
          TableSchema: nameSpace + table.name,
          TableSchemaType: "Main",
          SchemaCategory: "Tenant",
          Description: table.name,
          SystemGroup: "Integrations",
          ProductModule: "Integration",
          Fields: table.fields,
        },
      },
    ],
    createContainer: true,
    commitContainer: true,
    ignoreActionBlocksOnCommit: false,
  };
}

function createAppPayload(app) {
  return {
    records: [
      {
        appData: {
          ApplicationName: nameSpace + app.name,
          ApplicationType: "List Only",
          ApplicationStyle: "Standard",
          Description: app.name,
          ProductModule: "Implementation Support",
          SystemGroup: "Integrations",
          TableSchema: nameSpace + app.name,
          Pages: [
            {
              Page: "nsTsA",
            },
          ],
          ListFieldSelection: app.appFields
        },
      },
    ],
    createContainer: true,
    commitContainer: true,
    ignoreActionBlocksOnCommit: false,
  };
}

export default async function createNWCall(
  accessToken,
  apiBaseUrl,
  type,
  metaData
) {
  const url = `${apiBaseUrl}/v2/data/${type}`;

  try {
    console.log(`📡 Sending ${type} request → ${url} → ${metaData.name}`);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const config = {
      headers,
      timeout: 5000,
    };

    let payload = {};
    switch (type) {
      case "DataItems":
        payload = createDataitemPayload(metaData);
        break;
      case "TableSchemas":
        payload = createTablePayload(metaData);
        break;
      case "Applications":
        payload = createAppPayload(metaData);
        break;
      default:
        throw new Error(`Unsupported type: ${type}`);
    }

    console.log(payload);
    console.log(payload.records[0].appData);

    // Make the request and wait for it to finish
    const response = await axios.post(url, payload, config);

    console.log(response.data);

    console.log(`✅ ${type} created successfully → ${metaData.name}`);
    return response.data;
  } catch (error) {
    console.error(`❌ ${type} creation failed → ${metaData.name}`);
    if (error.response) {
      console.error(error.response.data); // optional: log server error
    } else {
      console.error(error.message);
    }
  }
}
