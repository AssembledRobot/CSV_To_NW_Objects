import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import processCsvFile from "./processCsvFile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// configure multer for in-memory file upload
const upload = multer({ storage: multer.memoryStorage() });

// serve the UI
app.use(express.static(path.join(__dirname, "public")));

// handle CSV upload
app.post("/upload", upload.single("csvfile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const csvBuffer = req.file.buffer;

    // Call processCsvFile with the buffer
    const result = await processCsvFile(csvBuffer);

    res.send(`Processing complete!<br><br>Result:<br>${JSON.stringify(result)}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing CSV");
  }
});

// start server
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
