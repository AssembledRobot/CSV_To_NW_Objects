import axios from "axios";
import { createPayload } from "./createPayloads.js";

export default async function createNWCall(accessToken, apiBaseUrl, data) {
  try {
    const url = `${apiBaseUrl}/v2/data/${data.type}`;
    console.log(`📡 Sending ${data.type} request → ${url} → ${data.name}`);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const config = {
      headers,
      timeout: 5000,
    };

    let payload = createPayload(data);

    // Make the request using the appropriate HTTP method
    const response = await axios[data.httpMethod](url, payload, config);

    console.log(`✅ ${data.type} created successfully → ${data.name}`);
    return response.data;
  } catch (error) {
    console.error(`❌ ${data.type} creation failed → ${data.name}`);
    if (error.response) {
      console.error(error.response.data); // optional: log server error
    } else {
      console.error(error.message);
    }
  }
}
