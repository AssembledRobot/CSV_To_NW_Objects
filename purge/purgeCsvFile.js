import axios from "axios";
import path from "path";

const nwExternalId = "3ljnqfnn1h";

export default async function purgeCsvFile(filePath, accessToken, apiBaseUrl) {
  const tableName = path.parse(filePath).name;
  const dataTypes = ["DataItems", "SecurityGroups", "TableSchemas", "Applications", "Permissions", "Roles"]


  for (type in dataType){

  }
  let url = `${apiBaseUrl}/v2/data/DataItems:fetch`; //TODO: loop through the types
  console.log(`📡 Fetching Data To Purge`);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  const config = {
    headers,
    timeout: 5000,
  };

  // fetches all the data matching the Id added in the insert
  let payload = {
    nwFilter: {
      $and: [
        {
          nwExternalId: nwExternalId,
        },
      ],
    },
    nwFields: "nwId",
    nwSkipTotal: true,
    nwTable: data.type,
  };

  // Make the request and wait for it to finish
  const response = await axios.post(url, payload, config);
  console.log(response.data.Data.records);



  // Delete all the data fetched above
  payload = {
    Data: {
      nwTable: "DataItems",
      records: [
        {
          appData: {
            nwId: "dcb574d8-e389-41c1-a04a-1f3f7903ce25",
          },
        },
      ],
    },
  };

  //console.log(`✅ ${data.type} created successfully → ${data.name}`);
  return response.data;
}
