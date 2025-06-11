import express from "express";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { exec } from "child_process";
import cors from "cors";

const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(cors());

// ✅ This ensures it’s mounted at `/api/compile`
app.post("/api/compile", async (req, res) => {
  const { template, data } = req.body;
  if (!template || !data) return res.status(400).send("Missing template or data");

  const id = uuidv4();
  const tempDir = `/tmp/${id}`;
  const typFile = `${tempDir}/cv.typ`;
  const pdfFile = `${tempDir}/output.pdf`;

  try {
    await fs.mkdir(tempDir);
    let filled = template;

    for (const [key, value] of Object.entries(data)) {
      const pattern = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      filled = filled.replace(pattern, value || "");
    }

    filled = filled.replace(/{{\s*[\w\.]+\s*}}/g, ""); // clean leftovers
    await fs.writeFile(typFile, filled);

    exec(`typst compile ${typFile} ${pdfFile}`, async (err) => {
      if (err) return res.status(500).send("Compilation failed");
      const pdf = await fs.readFile(pdfFile);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=generated.pdf");
      res.send(pdf);
    });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`✅ Typst PDF server running on port ${port}`));
