import axios from "axios";

export default async function insertTable(accessToken, apiBaseUrl, table) {
    const url = `${apiBaseUrl}/v2/data/TableSchemas`;

    try {
        console.log(`📡 Sending Table request → ${url} → ${table.name}`);

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        };

        const config = {
            headers,
            timeout: 5000
        };

        const payload = {
            "records": [
                {
                    "appData": {
                        "TableSchema": table.name,
                        "TableSchemaType": "Main",
                        "SchemaCategory": "Tenant",
                        "Description": table.name,
                        "SystemGroup": "Integrations",
                        "ProductModule": "Integration",
                        "Fields": table.fields
                    }
                }
            ],
            "createContainer": true,
            "commitContainer": true,
            "ignoreActionBlocksOnCommit": false
        };

        // Make the request and wait for it to finish
        const response = await axios.post(url, payload, config);

        console.log(`✅ Table created successfully → ${table.name}`);
        return response.data;

    } catch (error) {
        console.error(`❌ Table creation failed → ${table.name}`);
        if (error.response) {
            console.error(error.response.data); // optional: log server error
        } else {
            console.error(error.message);
        }
    }
}
