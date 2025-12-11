import axios from "axios";

// Note: the order here matters because of referential integrity
const dataType = [
  "Roles",
  "Permissions",
  "Applications",
  "TableSchemas",
  "DataItems",
  "SecurityGroups",
];

export default async function purgeCsvFile(
  nwExternalId,
  accessToken,
  apiBaseUrl
) {
  let url = "";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
  const config = {
    headers,
    timeout: 5000,
  };
  let payload = {};

  for (let type of dataType) {
    let name = "";
    switch (type) {
      case "DataItems":
        name = "DataItem";
        break;
      case "SecurityGroups":
        name = "SecurityGroup";
        break;
      case "TableSchemas":
        name = "TableSchema";
        break;
      case "Applications":
        name = "ApplicationName";
        break;
      case "Permissions":
        name = "Permission";
        break;
      case "Roles":
        name = "Role";
        break;
    }

    url = `${apiBaseUrl}/v2/data/${type}:fetch`;
    payload = {
      nwFilter: {
        $and: [
          {
            nwExternalId: nwExternalId,
          },
        ],
      },
      nwFields: `nwId,${name},nwExternalId`,
      nwSkipTotal: true,
      nwTable: type,
    };

    try {
      console.log(`📡 Fetching records from ${type}`);
      const fetchResponse = await axios.post(url, payload, config);

      let records = [];
      if (
        fetchResponse.data.Data &&
        fetchResponse.data.Data.records.length > 0
      ) {
        records = fetchResponse.data.Data.records;
        const purgeRecords = records.map((record) => ({
          appData: {
            nwId: record.appData.nwId,
            [name]: record.appData[name],
          },
        }));

        url = `${apiBaseUrl}/v2/data/${type}:delete`;
        payload = {
          records: purgeRecords,
          commitContainer: true,
          createContainer: true,
        };
        console.log(`🗑️ Purging records from ${type}`);
        const deleteResponse = await axios.post(url, payload, config);
      } else {
        console.log(
          `❌ No records found for ${type} with nwExternalId: ${nwExternalId}`
        );
      }
    } catch (error) {
      console.error(`Error purging data from ${type}:`, error);
      continue;
    }
  }
}
