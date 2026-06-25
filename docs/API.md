# File Conversion Service API Documentation

**Version:** 1.0.0  
**Base URL:** `https://localhost:3443` or `http://localhost:3443`  
**API Documentation (Interactive):** `http://localhost:3443/api-docs`

## Overview

The File Conversion Service API allows you to upload files and convert them between different formats. Currently supported conversions:
- **CSV → JSON**: Convert CSV files to JSON format
- **Markdown → PDF**: Convert Markdown files to PDF format

## Authentication

Currently, no authentication is required. All endpoints are publicly accessible.

## Endpoints

### 1. Upload File

Upload a file to the server for processing.

**Endpoint:** `POST /upload`

**Request:**
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `file` (required): The file to upload

**Response (200 OK):**
```json
{
  "message": "✅ File uploaded successfully",
  "filename": "abc123def456",
  "originalName": "document.pdf"
}
```

**Response (400 Bad Request):**
```json
{
  "message": "No file uploaded"
}
```

**Example using cURL:**
```bash
curl -X POST https://localhost:3443/upload \
  -F "file=@/path/to/your/file.csv"
```

---

### 2. Convert CSV to JSON

Convert a CSV file to JSON format.

**Endpoint:** `POST /convert/csv-to-json`

**Request:**
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `file` (required): CSV file to convert (max 10MB recommended)

**Response (200 OK):**
```json
{
  "message": "✅ File converted successfully",
  "jsonData": [
    {
      "name": "John Doe",
      "age": "30",
      "city": "New York"
    },
    {
      "name": "Jane Smith",
      "age": "25",
      "city": "Los Angeles"
    }
  ]
}
```

**Response (400 Bad Request):**
```json
{
  "message": "No file uploaded"
}
```

**Response (500 Internal Server Error):**
```json
{
  "message": "Conversion failed",
  "error": "Error details here"
}
```

**Example using cURL:**
```bash
curl -X POST https://localhost:3443/convert/csv-to-json \
  -F "file=@/path/to/data.csv"
```

**Example CSV Input:**
```csv
name,age,city
John Doe,30,New York
Jane Smith,25,Los Angeles
```

---

### 3. Convert Markdown to PDF

Convert a Markdown file to PDF format.

**Endpoint:** `POST /convert/md-to-pdf`

**Request:**
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `file` (required): Markdown file to convert (max 10MB recommended)

**Prerequisites:**
- Requires `pandoc` and `xelatex` to be installed on the server

**Response (200 OK):**
```json
{
  "message": "✅ Markdown successfully converted to PDF",
  "pdfFile": "uploads/1234567890-output.pdf"
}
```

**Response (400 Bad Request):**
```json
{
  "message": "No file uploaded"
}
```

**Response (500 Internal Server Error):**
```json
{
  "message": "Conversion failed",
  "error": "pandoc: command not found"
}
```

**Example using cURL:**
```bash
curl -X POST https://localhost:3443/convert/md-to-pdf \
  -F "file=@/path/to/document.md"
```

**Example Markdown Input:**
```markdown
# My Document

This is a sample markdown document.

## Section 1

Some content here.
```

---

## Error Handling

All endpoints follow a consistent error response format:

**Error Response Format:**
```json
{
  "message": "Error description",
  "error": "Detailed error information (optional)"
}
```

**HTTP Status Codes:**
- `200 OK`: Request successful
- `400 Bad Request`: Invalid request (e.g., missing file)
- `500 Internal Server Error`: Server error during processing

---

## Rate Limiting

Currently, no rate limiting is implemented. Please use the API responsibly.

## File Size Limits

- Recommended maximum file size: **10MB**
- Larger files may cause performance issues or timeouts

## Supported File Formats

### Input Formats:
- **CSV**: Comma-separated values files (`.csv`)
- **Markdown**: Markdown files (`.md`, `.markdown`)

### Output Formats:
- **JSON**: JavaScript Object Notation
- **PDF**: Portable Document Format

---

## Interactive API Documentation

For interactive API documentation with the ability to test endpoints directly, visit:

**Swagger UI:** `http://localhost:3443/api-docs`

**OpenAPI JSON:** `http://localhost:3443/api-docs/json`

---

## Examples

### JavaScript (Fetch API)

```javascript
// Upload and convert CSV to JSON
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('https://localhost:3443/convert/csv-to-json', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Conversion result:', data);
})
.catch(error => {
  console.error('Error:', error);
});
```

### Python (requests)

```python
import requests

# Convert CSV to JSON
url = 'https://localhost:3443/convert/csv-to-json'
files = {'file': open('data.csv', 'rb')}

response = requests.post(url, files=files, verify=False)
print(response.json())
```

### Node.js (axios)

```javascript
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const form = new FormData();
form.append('file', fs.createReadStream('data.csv'));

axios.post('https://localhost:3443/convert/csv-to-json', form, {
  headers: form.getHeaders(),
  httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error);
});
```

---

## Changelog

### Version 1.0.0
- Initial release
- CSV to JSON conversion
- Markdown to PDF conversion
- File upload endpoint
- Interactive API documentation (Swagger)

---

## Integration Resources

### Quick Start
- **[Quick Start Guide](./QUICK_START.md)** - Get started in 5 minutes
- **[Integration Guide](./INTEGRATION.md)** - Comprehensive integration examples

### Code Examples
- **[JavaScript Client](../examples/javascript-client.js)** - Node.js client library
- **[Python Client](../examples/python-client.py)** - Python client library

### Testing Tools
- **[Postman Collection](./postman-collection.json)** - Import into Postman for testing
- **[Swagger UI](http://localhost:3443/api-docs)** - Interactive API testing

---

## Support

For issues, questions, or contributions, please contact the Converty Team.

**Project Repository:** [GitHub](https://github.com/pestechnology/PESU_RR_CSE_B_P68_File_Conversion_Service_Converty)

