import dotenv from "dotenv";
dotenv.config();
import axios from "axios";


async function authenticate() {
  const url = process.env.NW_AUTH_URL;

  const username = process.env.NW_USERNAME;
  const password = process.env.NW_PASSWORD;

  // Create dynamic Base64 string for Basic Auth
  const basicAuth = Buffer.from(`${username}:${password}`).toString("base64");

  try {
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          "NwIsIntegrator": "true",
          "Authorization": `Basic ${basicAuth}`
        }
      }
    );

    const data = response.data;

    // Example response:
    // {
    //   access_token: "...",
    //   ApiBaseURL: "...",
    //   Release: "2025.2",
    //   refresh_token: "..."
    // }

    console.log("Authentication successful.");

    return {
      accessToken: data.access_token,
      apiBaseUrl: data.ApiBaseURL
    };

  } catch (error) {
    console.error("Authentication failed:", error.message);
    if (error.response) {
      console.error("Server response:", error.response.data);
    }
    throw error;
  }
}

export default authenticate;
