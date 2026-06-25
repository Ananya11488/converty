import express, { Request, Response } from "express";
import multer from "multer";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { logConversion } from "../logger";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/**
 * @swagger
 * /convert/md-to-pdf:
 *   post:
 *     summary: Convert Markdown file to PDF
 *     description: Upload a Markdown (.md) file and convert it to PDF format. Requires pandoc and xelatex to be installed on the server.
 *     tags: [Conversion]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Markdown file to convert (max 10MB recommended)
 *     responses:
 *       200:
 *         description: Markdown file converted to PDF successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MdToPdfResponse'
 *             example:
 *               message: "✅ Markdown successfully converted to PDF"
 *               pdfFile: "uploads/1234567890-output.pdf"
 *       400:
 *         description: No file uploaded or invalid file
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Conversion failed (pandoc/xelatex not available or file error)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST /convert/md-to-pdf
router.post("/convert/md-to-pdf", upload.single("file"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const mdPath = req.file.path;
  const pdfPath = path.join("uploads", `${Date.now()}-output.pdf`);
  const command = `pandoc "${mdPath}" -o "${pdfPath}" --pdf-engine=xelatex`;

  exec(command, (error) => {
    if (error) {
      console.error("Conversion failed:", error.message);
      return res.status(500).json({
        message: "Conversion failed",
        error: error.message,
      });
    }

    fs.unlinkSync(mdPath);
    logConversion("Markdown → PDF", req.file!.filename); // ✅ the '!' tells TS it's definitely defined

    return res.json({
      message: "✅ Markdown successfully converted to PDF",
      pdfFile: pdfPath,
    });
  });
  
  // Handler sets up async exec operation, no immediate return needed
  return;
});

export default router;
