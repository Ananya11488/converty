#!/usr/bin/env python3
"""
Python Client for File Conversion Service

Usage:
    from file_conversion_client import FileConversionClient
    
    client = FileConversionClient('http://localhost:3443')
    json_data = client.convert_csv_to_json('data.csv')
"""

import requests
from typing import List, Dict, Any, Optional
import os
import sys


class FileConversionClient:
    """Client for File Conversion Service API"""
    
    def __init__(self, base_url: str = "http://localhost:3443", verify_ssl: bool = False):
        """
        Initialize the client
        
        Args:
            base_url: Base URL of the API
            verify_ssl: Whether to verify SSL certificates (False for self-signed)
        """
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.session.verify = verify_ssl
    
    def convert_csv_to_json(self, file_path: str) -> List[Dict[str, Any]]:
        """
        Convert CSV file to JSON
        
        Args:
            file_path: Path to the CSV file
            
        Returns:
            List of dictionaries representing CSV rows
            
        Raises:
            requests.RequestException: If the request fails
            FileNotFoundError: If the file doesn't exist
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
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
            FileNotFoundError: If the file doesn't exist
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
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
            FileNotFoundError: If the file doesn't exist
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
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
    
    def get_health_details(self) -> Dict[str, Any]:
        """
        Get detailed health information
        
        Returns:
            Dictionary with detailed health data
            
        Raises:
            requests.RequestException: If the request fails
        """
        url = f"{self.base_url}/health/detailed"
        response = self.session.get(url)
        response.raise_for_status()
        return response.json()


# Example usage
if __name__ == "__main__":
    client = FileConversionClient("http://localhost:3443")
    
    # Health check
    print("Checking service health...")
    if client.health_check():
        print("✓ Service is healthy")
        
        # Get detailed health
        health = client.get_health_details()
        print(f"  Uptime: {health.get('uptime', 0)} seconds")
        print(f"  Version: {health.get('version', 'unknown')}")
    else:
        print("✗ Service is not responding")
        sys.exit(1)
    
    # Example: Convert CSV to JSON
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
        try:
            print(f"\nConverting {file_path} to JSON...")
            json_data = client.convert_csv_to_json(file_path)
            print(f"✓ Converted {len(json_data)} rows")
            print("\nSample data:")
            for i, row in enumerate(json_data[:3]):  # Show first 3 rows
                print(f"  Row {i+1}: {row}")
        except FileNotFoundError as e:
            print(f"✗ Error: {e}")
        except requests.RequestException as e:
            print(f"✗ Conversion failed: {e}")
    else:
        print("\nUsage: python python-client.py <csv-file>")

