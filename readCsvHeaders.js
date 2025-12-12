import { Readable } from "stream";
import csv from "csv-parser";

/**
 * Reads the first two rows of a CSV: headers + types
 */
export default async function readCsvHeaders(input) {
  return new Promise((resolve, reject) => {
    const rows = [];
    
    // Handle both file paths (string) and buffers
    const stream = typeof input === "string" 
      ? require("fs").createReadStream(input)
      : Readable.from([input]);
    
    stream
      .pipe(csv({ headers: false }))
      .on("data", (row) => {
        rows.push(row);
        if (rows.length === 2) {
          resolve(rows);
        }
      })
      .on("error", reject);
  });
}
