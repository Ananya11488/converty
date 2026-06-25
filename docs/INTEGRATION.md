# Integration Guide

**Version:** 1.0.0  
**Last Updated:** 2025

This guide helps developers quickly integrate the File Conversion Service API into their applications.

## Quick Start

### 1. Base URL

```
Development: http://localhost:3443
Production: https://your-domain.com:3443
```

### 2. API Endpoints

- **Upload File:** `POST /upload`
- **Convert CSV to JSON:** `POST /convert/csv-to-json`
- **Convert Markdown to PDF:** `POST /convert/md-to-pdf`
- **Health Check:** `GET /health`
- **API Documentation:** `GET /api-docs`

### 3. Authentication

Currently, no authentication is required. All endpoints are publicly accessible.

---

## Integration Examples

### JavaScript/TypeScript (Browser)

```javascript
/**
 * Convert CSV to JSON using Fetch API
 */
async function convertCsvToJson(file) {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('http://localhost:3443/convert/csv-to-json', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.jsonData;
  } catch (error) {
    console.error('Conversion failed:', error);
    throw error;
  }
}

// Usage
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    const jsonData = await convertCsvToJson(file);
    console.log('Converted data:', jsonData);
  }
});
```

### Node.js (TypeScript/JavaScript)

```typescript
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

/**
 * File Conversion Service Client
 */
class FileConversionClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3443') {
    this.baseUrl = baseUrl;
  }

  /**
   * Convert CSV file to JSON
   */
  async convertCsvToJson(filePath: string): Promise<any[]> {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    try {
      const response = await axios.post(
        `${this.baseUrl}/convert/csv-to-json`,
        form,
        {
          headers: form.getHeaders(),
        }
      );

      return response.data.jsonData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Conversion failed: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Convert Markdown file to PDF
   */
  async convertMdToPdf(filePath: string): Promise<string> {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    try {
      const response = await axios.post(
        `${this.baseUrl}/convert/md-to-pdf`,
        form,
        {
          headers: form.getHeaders(),
        }
      );

      return response.data.pdfFile;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Conversion failed: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Upload a file
   */
  async uploadFile(filePath: string): Promise<{ filename: string; originalName: string }> {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    try {
      const response = await axios.post(
        `${this.baseUrl}/upload`,
        form,
        {
          headers: form.getHeaders(),
        }
      );

      return {
        filename: response.data.filename,
        originalName: response.data.originalName,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Upload failed: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Check service health
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/health`);
      return response.data.status === 'healthy';
    } catch (error) {
      return false;
    }
  }
}

// Usage
const client = new FileConversionClient('http://localhost:3443');

// Convert CSV to JSON
client.convertCsvToJson('./data.csv')
  .then(jsonData => console.log('Converted:', jsonData))
  .catch(error => console.error('Error:', error));

// Convert Markdown to PDF
client.convertMdToPdf('./document.md')
  .then(pdfPath => console.log('PDF created at:', pdfPath))
  .catch(error => console.error('Error:', error));
```

### Python

```python
import requests
from typing import List, Dict, Any
import os

class FileConversionClient:
    """Client for File Conversion Service API"""
    
    def __init__(self, base_url: str = "http://localhost:3443"):
        self.base_url = base_url
        self.session = requests.Session()
        # Disable SSL verification for self-signed certificates
        self.session.verify = False
    
    def convert_csv_to_json(self, file_path: str) -> List[Dict[str, Any]]:
        """
        Convert CSV file to JSON
        
        Args:
            file_path: Path to the CSV file
            
        Returns:
            List of dictionaries representing CSV rows
            
        Raises:
            requests.RequestException: If the request fails
        """
        url = f"{self.base_url}/convert/csv-to-json"
        
        with open(file_path, 'rb') as f:
            files = {'file': (os.path.basename(file_path), f, 'text/csv')}
            response = self.session.post(url, files=files)
            response.raise_for_status()
            
            data = response.json()
            return data.get('jsonData', [])
    
    def convert_md_to_pdf(self, file_path: str) -> str:
        """
        Convert Markdown file to PDF
        
        Args:
            file_path: Path to the Markdown file
            
        Returns:
            Path to the generated PDF file
            
        Raises:
            requests.RequestException: If the request fails
        """
        url = f"{self.base_url}/convert/md-to-pdf"
        
        with open(file_path, 'rb') as f:
            files = {'file': (os.path.basename(file_path), f, 'text/markdown')}
            response = self.session.post(url, files=files)
            response.raise_for_status()
            
            data = response.json()
            return data.get('pdfFile', '')
    
    def upload_file(self, file_path: str) -> Dict[str, str]:
        """
        Upload a file to the server
        
        Args:
            file_path: Path to the file to upload
            
        Returns:
            Dictionary with filename and originalName
            
        Raises:
            requests.RequestException: If the request fails
        """
        url = f"{self.base_url}/upload"
        
        with open(file_path, 'rb') as f:
            files = {'file': (os.path.basename(file_path), f)}
            response = self.session.post(url, files=files)
            response.raise_for_status()
            
            return response.json()
    
    def health_check(self) -> bool:
        """
        Check if the service is healthy
        
        Returns:
            True if service is healthy, False otherwise
        """
        try:
            url = f"{self.base_url}/health"
            response = self.session.get(url, timeout=5)
            return response.status_code == 200 and response.json().get('status') == 'healthy'
        except requests.RequestException:
            return False

# Usage
if __name__ == "__main__":
    client = FileConversionClient("http://localhost:3443")
    
    # Convert CSV to JSON
    try:
        json_data = client.convert_csv_to_json("data.csv")
        print("Converted data:", json_data)
    except requests.RequestException as e:
        print(f"Error: {e}")
    
    # Convert Markdown to PDF
    try:
        pdf_path = client.convert_md_to_pdf("document.md")
        print(f"PDF created at: {pdf_path}")
    except requests.RequestException as e:
        print(f"Error: {e}")
    
    # Health check
    if client.health_check():
        print("Service is healthy")
    else:
        print("Service is not responding")
```

### Java

```java
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

public class FileConversionClient {
    private String baseUrl;
    private RestTemplate restTemplate;

    public FileConversionClient(String baseUrl) {
        this.baseUrl = baseUrl;
        this.restTemplate = new RestTemplate();
    }

    public List<Map<String, Object>> convertCsvToJson(String filePath) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new FileSystemResource(new File(filePath)));

        HttpEntity<MultiValueMap<String, Object>> requestEntity = 
            new HttpEntity<>(body, headers);

        String url = baseUrl + "/convert/csv-to-json";
        
        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            requestEntity,
            Map.class
        );

        Map<String, Object> responseBody = response.getBody();
        return (List<Map<String, Object>>) responseBody.get("jsonData");
    }

    public String convertMdToPdf(String filePath) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new FileSystemResource(new File(filePath)));

        HttpEntity<MultiValueMap<String, Object>> requestEntity = 
            new HttpEntity<>(body, headers);

        String url = baseUrl + "/convert/md-to-pdf";
        
        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            requestEntity,
            Map.class
        );

        Map<String, Object> responseBody = response.getBody();
        return (String) responseBody.get("pdfFile");
    }

    public boolean healthCheck() {
        try {
            String url = baseUrl + "/health";
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            return response.getStatusCode() == HttpStatus.OK && 
                   "healthy".equals(response.getBody().get("status"));
        } catch (Exception e) {
            return false;
        }
    }
}
```

### cURL Examples

```bash
# Convert CSV to JSON
curl -X POST http://localhost:3443/convert/csv-to-json \
  -F "file=@/path/to/data.csv"

# Convert Markdown to PDF
curl -X POST http://localhost:3443/convert/md-to-pdf \
  -F "file=@/path/to/document.md"

# Upload file
curl -X POST http://localhost:3443/upload \
  -F "file=@/path/to/file.txt"

# Health check
curl http://localhost:3443/health
```

---

## Error Handling

### Common Error Responses

```json
// 400 Bad Request
{
  "status": "error",
  "message": "No file uploaded"
}

// 500 Internal Server Error
{
  "status": "error",
  "message": "Conversion failed",
  "error": "Detailed error message"
}
```

### Error Handling Pattern

```javascript
async function convertWithErrorHandling(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:3443/convert/csv-to-json', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Handle different error types
    if (error.name === 'TypeError') {
      console.error('Network error:', error.message);
    } else {
      console.error('Conversion error:', error.message);
    }
    throw error;
  }
}
```

---

## Best Practices

### 1. Always Check Health Before Operations

```javascript
async function ensureServiceAvailable() {
  const response = await fetch('http://localhost:3443/health');
  const data = await response.json();
  
  if (data.status !== 'healthy') {
    throw new Error('Service is not available');
  }
}
```

### 2. Implement Retry Logic

```javascript
async function convertWithRetry(file, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await convertCsvToJson(file);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### 3. Validate File Before Upload

```javascript
function validateFile(file, maxSize = 10 * 1024 * 1024) {
  if (file.size > maxSize) {
    throw new Error(`File size exceeds ${maxSize} bytes`);
  }
  
  // Add more validation as needed
  return true;
}
```

### 4. Handle Timeouts

```javascript
async function convertWithTimeout(file, timeout = 30000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:3443/convert/csv-to-json', {
      method: 'POST',
      body: formData,
      signal: controller.signal
    });

    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}
```

---

## Testing Your Integration

### 1. Test Health Endpoint

```bash
curl http://localhost:3443/health
```

Expected response:
```json
{
  "status": "healthy",
  "uptime": 12345,
  "timestamp": "2025-01-XX...",
  "version": "1.0.0"
}
```

### 2. Test File Upload

```bash
curl -X POST http://localhost:3443/upload \
  -F "file=@test-file.txt"
```

### 3. Test Conversion

```bash
# Create a test CSV file
echo "name,age
John,30
Jane,25" > test.csv

# Convert it
curl -X POST http://localhost:3443/convert/csv-to-json \
  -F "file=@test.csv"
```

---

## Troubleshooting

### Issue: Connection Refused

**Solution:** Ensure the service is running on the correct port (3443).

```bash
# Check if service is running
curl http://localhost:3443/health
```

### Issue: SSL Certificate Error

**Solution:** For self-signed certificates, disable SSL verification (development only).

```javascript
// Node.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Python
import ssl
ssl._create_default_https_context = ssl._create_unverified_context
```

### Issue: File Size Too Large

**Solution:** Implement file size validation before upload.

```javascript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
if (file.size > MAX_FILE_SIZE) {
  throw new Error('File too large');
}
```

### Issue: Conversion Timeout

**Solution:** Increase timeout or implement retry logic.

```javascript
const controller = new AbortController();
setTimeout(() => controller.abort(), 60000); // 60 seconds
```

---

## SDK Packages

### JavaScript/TypeScript SDK

```bash
npm install file-conversion-client
```

```javascript
import { FileConversionClient } from 'file-conversion-client';

const client = new FileConversionClient('http://localhost:3443');
const result = await client.convertCsvToJson('./data.csv');
```

### Python SDK

```bash
pip install file-conversion-client
```

```python
from file_conversion_client import FileConversionClient

client = FileConversionClient('http://localhost:3443')
result = client.convert_csv_to_json('data.csv')
```

---

## Support

For integration help:
- **Documentation:** `/api-docs` (Swagger UI)
- **OpenAPI Spec:** `/api-docs/json`
- **GitHub Issues:** [Repository Issues](https://github.com/pestechnology/PESU_RR_CSE_B_P68_File_Conversion_Service_Converty/issues)

---

## Next Steps

1. Review the [API Documentation](./API.md) for detailed endpoint information
2. Test the API using the [Postman Collection](./postman-collection.json)
3. Check the [Availability Guide](./AVAILABILITY.md) for production deployment
4. Integrate using the code examples above

