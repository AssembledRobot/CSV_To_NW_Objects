import readCsvHeaders from "./readCsvHeaders.js";
import createNWCall from "./createNWCall.js";
import path from "path";

export default async function purgeCsvFile(filePath, accessToken, apiBaseUrl) {
  const rows = await readCsvHeaders(filePath);
  const headersRow = Object.values(rows[0]);
  const typesRow = Object.values(rows[1]);
  const tableName = path.parse(filePath).name;

  let role = {
    name: tableName,
    type: "Roles:delete",
    roleType: ["Duty", "Functional"],
  };
  await createNWCall(accessToken, apiBaseUrl, role);
}
