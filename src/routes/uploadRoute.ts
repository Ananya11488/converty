import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";

const router = express.Router();

// ✅ Multer setup for uploads
const upload = multer({ dest: "uploads/" });

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file
 *     description: Upload a file to the server. The file will be stored temporarily in the uploads directory.
 *     tags: [Upload]
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
 *                 description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: No file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "No file uploaded"
 */
// ✅ POST endpoint: upload a file
router.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Ensure uploads directory exists
  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
  }

  return res.json({
    message: "✅ File uploaded successfully",
    filename: req.file.filename,
    originalName: req.file.originalname,
  });
});

export default router;
