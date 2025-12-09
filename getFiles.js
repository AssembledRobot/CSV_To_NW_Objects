import fs from "fs";
import path from "path";

export default function getFiles() {
  const inputFolder = "./inputs";
  const files = fs.readdirSync(inputFolder);

  const csvFiles = files.filter((file) => file.endsWith(".csv"));
  return csvFiles.map((file) => path.join(inputFolder, file));
}
