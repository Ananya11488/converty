# Converty

## Secure File Conversion REST API

Converty is a backend file conversion service built using **TypeScript**, **Express.js**, and **Python** that enables secure file upload, conversion, and download through REST APIs. The application follows a modular architecture with API documentation, security middleware, logging, and CI/CD integration.

---

## Features

- Secure file upload and validation
- File format conversion APIs
- Download converted files
- Interactive Swagger API documentation
- HTTPS support with SSL certificates
- Security middleware using Helmet
- Centralized error handling
- Request logging
- CI/CD workflow using GitHub Actions
- Example API clients for integration

---

## Supported Conversions

- CSV → JSON
- Markdown → PDF

The modular architecture makes it easy to extend the system with additional file converters.

---

## Tech Stack

### Backend

- TypeScript
- Node.js
- Express.js

### Python Services

- FastAPI
- Pydantic
- Uvicorn

### API & Security

- REST APIs
- Swagger / OpenAPI
- Helmet
- Multer

### DevOps

- GitHub Actions
- PM2

---

## Architecture

```

Client

↓

Express Server

↓

API Routes

↓

Validation & Security Middleware

↓

Conversion Services

↓

File Storage

↓

Download API

```

The project follows a modular backend architecture where routing, middleware, conversion logic, utilities, and documentation are separated into independent modules for easier maintenance and scalability.

---

## Project Structure

```
Converty/
│
├── backend/
│   ├── api/
│   ├── services/
│   ├── utils/
│   └── db/
│
├── src/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── utils/
│
├── docs/
├── examples/
├── package.json
└── README.md
```

---

## Getting Started

### Clone Repository

```bash
git clone https://github.com/Ananya11488/converty.git
```

### Install Node Dependencies

```bash
npm install
```

### Install Python Dependencies

```bash
pip install -r requirements.txt
```

### Start Development Server

```bash
npm run dev
```

### Build Project

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

---

## API Documentation

After starting the application, Swagger documentation is available at:

```
https://localhost:3000/api-docs
```

---

## Screenshots

Add screenshots for:

- Swagger Documentation
- File Upload API
- Conversion API
- Download API

---

## Documentation

Additional documentation is available in the **docs/** directory.

- API Documentation
- Integration Guide
- Quick Start Guide
- Availability Report
- Software Requirement Specification
- Software Architecture Document
- Project Retrospective

---

## Future Improvements

- Support additional conversion formats
- User authentication and authorization
- Batch file conversion
- Cloud storage integration
- Docker deployment
- Conversion history dashboard
- Rate limiting and caching
