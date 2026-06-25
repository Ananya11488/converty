# Quick Start Guide

Get up and running with the File Conversion Service API in 5 minutes.

## Prerequisites

- Node.js 18+ (for running the service)
- cURL or Postman (for testing)
- A file to convert (CSV or Markdown)

## Step 1: Start the Service

```bash
# Clone the repository
git clone https://github.com/pestechnology/PESU_RR_CSE_B_P68_File_Conversion_Service_Converty.git
cd PESU_RR_CSE_B_P68_File_Conversion_Service_Converty

# Install dependencies
npm install

# Build the project
npm run build

# Start the service
npm start
```

The service will start on `http://localhost:3443`

## Step 2: Verify Service is Running

```bash
curl http://localhost:3443/health
```

Expected response:
```json
{
  "status": "healthy",
  "uptime": 5,
  "timestamp": "2025-01-XX...",
  "version": "1.0.0"
}
```

## Step 3: Test File Conversion

### Convert CSV to JSON

1. Create a test CSV file:
```bash
echo "name,age,city
John Doe,30,New York
Jane Smith,25,Los Angeles" > test.csv
```

2. Convert it:
```bash
curl -X POST http://localhost:3443/convert/csv-to-json \
  -F "file=@test.csv"
```

Expected response:
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

### Convert Markdown to PDF

1. Create a test Markdown file:
```bash
echo "# My Document

This is a test document.

## Section 1

Some content here." > test.md
```

2. Convert it:
```bash
curl -X POST http://localhost:3443/convert/md-to-pdf \
  -F "file=@test.md"
```

Expected response:
```json
{
  "message": "✅ Markdown successfully converted to PDF",
  "pdfFile": "uploads/1234567890-output.pdf"
}
```

## Step 4: Explore the API

### Interactive Documentation

Open in your browser:
```
http://localhost:3443/api-docs
```

This provides an interactive Swagger UI where you can:
- View all endpoints
- See request/response schemas
- Test endpoints directly
- Download OpenAPI specification

### Postman Collection

Import the Postman collection:
```
docs/postman-collection.json
```

This includes pre-configured requests for all endpoints.

## Step 5: Integrate in Your Application

### JavaScript Example

```javascript
// Convert CSV to JSON
async function convertCsv(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:3443/convert/csv-to-json', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  return data.jsonData;
}

// Usage
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    const jsonData = await convertCsv(file);
    console.log('Converted:', jsonData);
  }
});
```

### Python Example

```python
import requests

def convert_csv_to_json(file_path):
    url = 'http://localhost:3443/convert/csv-to-json'
    
    with open(file_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(url, files=files, verify=False)
        response.raise_for_status()
        return response.json()['jsonData']

# Usage
json_data = convert_csv_to_json('data.csv')
print(json_data)
```

## Common Use Cases

### 1. Batch CSV Conversion

```bash
# Convert multiple CSV files
for file in *.csv; do
  curl -X POST http://localhost:3443/convert/csv-to-json \
    -F "file=@$file" > "${file%.csv}.json"
done
```

### 2. Monitor Service Health

```bash
# Check health every minute
watch -n 60 'curl -s http://localhost:3443/health | jq .'
```

### 3. Integration Testing

```javascript
// Test service availability
async function testService() {
  const response = await fetch('http://localhost:3443/health');
  const data = await response.json();
  return data.status === 'healthy';
}
```

## Next Steps

- Read the [Integration Guide](./INTEGRATION.md) for detailed integration examples
- Check the [API Documentation](./API.md) for complete endpoint reference
- Review [Availability Guide](./AVAILABILITY.md) for production deployment
- Explore the [Swagger UI](http://localhost:3443/api-docs) for interactive testing

## Troubleshooting

### Service won't start

1. Check if port 3443 is available:
```bash
lsof -i :3443
```

2. Check for errors:
```bash
npm run dev
```

### SSL Certificate Errors

For development, the service will fall back to HTTP if certificates are missing. For production, generate certificates:
```bash
npm run generate-cert
```

### Conversion Fails

1. Check service logs
2. Verify file format is correct
3. Check file size (max 10MB recommended)
4. For MD to PDF, ensure pandoc is installed

## Support

- **Documentation:** `/api-docs`
- **GitHub:** [Repository](https://github.com/pestechnology/PESU_RR_CSE_B_P68_File_Conversion_Service_Converty)
- **Issues:** [GitHub Issues](https://github.com/pestechnology/PESU_RR_CSE_B_P68_File_Conversion_Service_Converty/issues)

