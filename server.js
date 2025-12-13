import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import processCsvFile from "./processCsvFile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// parse form data
app.use(express.urlencoded({ extended: true }));

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
    const filename = req.file.originalname;
    const tableName = filename.replace(/\.csv$/, "");

    // Extract checkbox selections from form data
    const checkboxOptions = {
      dataItems: req.body.dataItems === "on",
      securityGroups: req.body.securityGroups === "on",
      tables: req.body.tables === "on",
      applications: req.body.applications === "on",
      permissionsMain: req.body.permissionsMain === "on",
      permissions: {
        permissionApps: req.body.permissionApps === "on",
        permissionTableR: req.body.permissionTableR === "on",
        permissionTableRU: req.body.permissionTableRU === "on",
        permissionTableRUI: req.body.permissionTableRUI === "on",
        permissionTableRUID: req.body.permissionTableRUID === "on",
        permissionLogicBlocksR: req.body.permissionLogicBlocksR === "on",
        permissionLogicBlocksRUID: req.body.permissionLogicBlocksRUID === "on",
      },
      rolesMain: req.body.rolesMain === "on",
      roles: {
        roleViewer: req.body.roleViewer === "on",
        roleProcessor: req.body.roleProcessor === "on",
        roleAdmin: req.body.roleAdmin === "on",
      },
    };

    // Call processCsvFile with the buffer, table name, and checkbox options
    const result = await processCsvFile(csvBuffer, tableName, checkboxOptions);

    res.json(result);
  } catch (err) {
    console.error("Error processing CSV:", err);
    res.status(500).send(`Error processing CSV: ${err.message}`);
  }
});

// start server
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
