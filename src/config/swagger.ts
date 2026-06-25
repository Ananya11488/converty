import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "File Conversion Service API",
      version: "1.0.0",
      description: "API documentation for the File Conversion Service. Convert files between different formats (Markdown to PDF, CSV to JSON).",
      contact: {
        name: "Converty Team",
        email: "support@converty.example.com",
      },
      license: {
        name: "ISC",
        url: "https://opensource.org/licenses/ISC",
      },
    },
    servers: [
      {
        url: "https://localhost:3443",
        description: "HTTPS Development Server",
      },
      {
        url: "http://localhost:3443",
        description: "HTTP Development Server (fallback)",
      },
    ],
    tags: [
      {
        name: "Upload",
        description: "File upload endpoints",
      },
      {
        name: "Conversion",
        description: "File conversion endpoints",
      },
      {
        name: "Health",
        description: "Health check and monitoring endpoints",
      },
    ],
    components: {
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
            },
            error: {
              type: "string",
              description: "Detailed error information",
            },
          },
        },
        UploadResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "✅ File uploaded successfully",
            },
            filename: {
              type: "string",
              description: "Server-generated filename",
              example: "abc123def456",
            },
            originalName: {
              type: "string",
              description: "Original filename from client",
              example: "document.pdf",
            },
          },
        },
        CsvToJsonResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "✅ File converted successfully",
            },
            jsonData: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
              },
              description: "Array of JSON objects parsed from CSV",
            },
          },
        },
        MdToPdfResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "✅ Markdown successfully converted to PDF",
            },
            pdfFile: {
              type: "string",
              description: "Path to the generated PDF file",
              example: "uploads/1234567890-output.pdf",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/index.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

