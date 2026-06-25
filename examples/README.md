# Integration Examples

This directory contains ready-to-use client libraries and code examples for integrating with the File Conversion Service API.

## Available Examples

### JavaScript/Node.js Client
**File:** `javascript-client.js`

A complete Node.js client library with all API methods.

**Installation:**
```bash
npm install axios form-data
```

**Usage:**
```javascript
const FileConversionClient = require('./javascript-client');

const client = new FileConversionClient('http://localhost:3443');

// Convert CSV to JSON
const jsonData = await client.convertCsvToJson('./data.csv');
console.log(jsonData);

// Convert Markdown to PDF
const pdfPath = await client.convertMdToPdf('./document.md');
console.log(pdfPath);

// Health check
const isHealthy = await client.healthCheck();
console.log('Service is', isHealthy ? 'healthy' : 'unhealthy');
```

**Command Line Usage:**
```bash
node javascript-client.js data.csv
```

### Python Client
**File:** `python-client.py`

A complete Python client library with all API methods.

**Installation:**
```bash
pip install requests
```

**Usage:**
```python
from python_client import FileConversionClient

client = FileConversionClient('http://localhost:3443')

# Convert CSV to JSON
json_data = client.convert_csv_to_json('data.csv')
print(json_data)

# Convert Markdown to PDF
pdf_path = client.convert_md_to_pdf('document.md')
print(pdf_path)

# Health check
if client.health_check():
    print('Service is healthy')
```

**Command Line Usage:**
```bash
python python-client.py data.csv
```

## Quick Integration

### Copy and Customize

1. Copy the client file for your language
2. Modify the `baseUrl` to match your deployment
3. Integrate into your application

### Browser Integration

For browser usage, see the JavaScript examples in the [Integration Guide](../docs/INTEGRATION.md).

## Testing

All examples include error handling and can be used for testing:

```bash
# Test JavaScript client
node javascript-client.js test.csv

# Test Python client
python python-client.py test.csv
```

## Next Steps

- Review the [Integration Guide](../docs/INTEGRATION.md) for more examples
- Check the [Quick Start Guide](../docs/QUICK_START.md) for setup instructions
- Import the [Postman Collection](../docs/postman-collection.json) for API testing

