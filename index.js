import dotenv from "dotenv";
dotenv.config();

import csv from "csv-parser";
import fs from "fs";

// import authenticate from "./auth.js";
// import createDataItem from "./InsertDataItem.js"

// const test = async () => {
//   const auth = await authenticate();
//   console.log(auth);
// };
// //test();


fs.createReadStream("input.csv")
  .pipe(csv())
  .on("data", (row) => {
    console.log(row)
  });

