import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import csv from "csv-parser";
import { logConversion } from "../logger"; // ✅ added import

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/**
 * @swagger
 * /convert/csv-to-json:
 *   post:
 *     summary: Convert CSV file to JSON
 *     description: Upload a CSV file and convert it to JSON format. The CSV will be parsed and returned as an array of JSON objects.
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
 *                 description: CSV file to convert (max 10MB recommended)
 *     responses:
 *       200:
 *         description: CSV file converted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CsvToJsonResponse'
 *             example:
 *               message: "✅ File converted successfully"
 *               jsonData:
 *                 - name: "John Doe"
 *                   age: "30"
 *                   city: "New York"
 *                 - name: "Jane Smith"
 *                   age: "25"
 *                   city: "Los Angeles"
 *       400:
 *         description: No file uploaded or invalid file
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Conversion failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST: CSV → JSON conversion
router.post("/convert/csv-to-json", upload.single("file"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const results: any[] = [];
  const filePath = req.file.path;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      fs.unlinkSync(filePath);

      // ✅ Type assertion to fix TS warning
      logConversion("CSV → JSON", req.file!.filename);

      return res.json({
        message: "✅ File converted successfully",
        jsonData: results,
      });
    })
    .on("error", (error) => {
      console.error("Error while converting CSV:", error);
      return res.status(500).json({ message: "Conversion failed", error: error.message });
    });
  
  // Handler sets up async stream processing, no immediate return needed
  return;
});

export default router;
