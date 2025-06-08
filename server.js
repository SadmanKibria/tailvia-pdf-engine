import express from "express";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import { exec } from "child_process";
import cors from "cors";

const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(cors());

app.post("/compile", async (req, res) => {
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
      filled = filled.replace(pattern, value);
    }
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

app.listen(3000, () => console.log("Typst server running on port 3000"));
