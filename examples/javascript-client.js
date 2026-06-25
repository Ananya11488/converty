/**
 * JavaScript/Node.js Client for File Conversion Service
 * 
 * Usage:
 *   const client = new FileConversionClient('http://localhost:3443');
 *   const jsonData = await client.convertCsvToJson('./data.csv');
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

class FileConversionClient {
  constructor(baseUrl = 'http://localhost:3443') {
    this.baseUrl = baseUrl;
  }

  /**
   * Convert CSV file to JSON
   * @param {string} filePath - Path to CSV file
   * @returns {Promise<Array>} Array of JSON objects
   */
  async convertCsvToJson(filePath) {
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
      if (error.response) {
        throw new Error(`Conversion failed: ${error.response.data.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Convert Markdown file to PDF
   * @param {string} filePath - Path to Markdown file
   * @returns {Promise<string>} Path to generated PDF
   */
  async convertMdToPdf(filePath) {
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
      if (error.response) {
        throw new Error(`Conversion failed: ${error.response.data.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Upload a file
   * @param {string} filePath - Path to file
   * @returns {Promise<Object>} Upload result with filename and originalName
   */
  async uploadFile(filePath) {
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
      if (error.response) {
        throw new Error(`Upload failed: ${error.response.data.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Check service health
   * @returns {Promise<boolean>} True if service is healthy
   */
  async healthCheck() {
    try {
      const response = await axios.get(`${this.baseUrl}/health`, { timeout: 5000 });
      return response.data.status === 'healthy';
    } catch (error) {
      return false;
    }
  }

  /**
   * Get detailed health information
   * @returns {Promise<Object>} Detailed health data
   */
  async getHealthDetails() {
    try {
      const response = await axios.get(`${this.baseUrl}/health/detailed`);
      return response.data;
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  }
}

// Example usage
if (require.main === module) {
  (async () => {
    const client = new FileConversionClient('http://localhost:3443');

    // Health check
    console.log('Checking service health...');
    const isHealthy = await client.healthCheck();
    console.log('Service is', isHealthy ? 'healthy' : 'unhealthy');

    if (isHealthy) {
      // Example: Convert CSV to JSON
      if (process.argv[2]) {
        try {
          console.log(`Converting ${process.argv[2]} to JSON...`);
          const jsonData = await client.convertCsvToJson(process.argv[2]);
          console.log('Converted data:', JSON.stringify(jsonData, null, 2));
        } catch (error) {
          console.error('Error:', error.message);
        }
      }
    }
  })();
}

module.exports = FileConversionClient;

