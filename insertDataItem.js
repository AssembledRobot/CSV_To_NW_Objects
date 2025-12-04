import axios from "axios";

export default async function insertDataItem(accessToken, apiBaseUrl, dataItem) {
    const url = `${apiBaseUrl}/v2/data/DataItems`;

    try {
        console.log(`📡 Sending Data Item request → ${url} → ${dataItem.name}`);

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
        };

        const config = {
            headers,
            timeout: 5000
        };

        const payload = {
            records: [
                {
                    appData: {
                        DataItem: dataItem.name,
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

        // Make the request and wait for it to finish
        const response = await axios.post(url, payload, config);

        console.log(`✅ Data Item created successfully → ${dataItem.name}`);
        return response.data;

    } catch (error) {
        console.error(`❌ Data Item creation failed → ${dataItem.name}`);
        if (error.response) {
            console.error(error.response.data); // optional: log server error
        } else {
            console.error(error.message);
        }
    }
}
