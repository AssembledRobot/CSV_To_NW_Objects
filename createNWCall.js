import axios from "axios";
import {
  createDataitemPayload,
  createTablePayload,
  createAppPayload,
  createSecurityGroupPayload,
} from "./createPayloads.js";

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
      case "SecurityGroups":
        payload = createSecurityGroupPayload(metaData);
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
 
    // Make the request and wait for it to finish
    const response = await axios.post(url, payload, config);

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
