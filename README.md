<div align="center">

# 🚀 SwiftLink
### A Modern Full-Stack URL Shortener with Analytics, QR Codes, Redis Caching & Docker

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)]()
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)]()
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?logo=redis)]()
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)]()
[![JWT](https://img.shields.io/badge/Auth-JWT-orange)]()

### 🔗 Live
https://url-shortener-frontend-pzfy.onrender.com/

### ⚙️ Backend API
https://url-shortener-ti4q.onrender.com                    

</div>

---

# 📖 Overview

SwiftLink is a production-inspired URL shortening platform built using the MERN ecosystem.

Unlike traditional URL shorteners, SwiftLink provides secure authentication, QR code generation, analytics dashboard, Redis caching, Docker support, rate limiting, and click tracking.

The project focuses on scalable backend architecture while maintaining a modern and responsive React frontend.




# ✨ Features

## 🔐 Authentication

- User Registration
- Secure Login
- JWT Authentication
- Password Hashing using bcrypt
- Protected APIs
- Optional Authentication for Anonymous URL Shortening

---

## 🔗 URL Management

- Shorten Long URLs
- Custom Alias Support
- Automatic Alias Generation (NanoID)
- Delete URLs
- User Dashboard
- Redirect Service

---

## 📊 Analytics

- Total Clicks
- Unique Visitors
- Browser Distribution
- Device Distribution
- Daily Click Statistics
- Recent Click History
- Interactive Charts

---

## ⚡ Performance

- Redis URL Cache
- Redis Click Counter Cache
- Cache Synchronization
- Fast Redirect Lookup

---

## 🛡 Security

- JWT Authentication
- Password Hashing
- Rate Limiting
- Environment Variable Management
- Protected Routes

---

## 📱 Additional Features

- QR Code Generation
- Responsive UI
- Docker Support
- Docker Compose Setup
- MongoDB Atlas
- Redis Integration

---

# 🛠 Tech Stack

## Frontend

- React 19
- Vite
- JavaScript (ES Modules)
- React Router DOM
- Axios
- Chart.js
- React ChartJS 2
- QRCode
- ESLint

---

## Backend

- Node.js
- Express.js
- JavaScript (CommonJS)
- JWT
- bcryptjs
- NanoID
- dotenv
- cors
- ua-parser-js

---

## Database

- MongoDB Atlas

Collections

- Users
- URLs
- Click Analytics

---

## Cache

- Redis

---

## DevOps

- Docker
- Docker Compose
- Render Deployment

---

# 📂 Project Structure

```text
URL-Shortener
│
├── Frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── middleware
├── models
├── server.js
├── redisClient.js
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/ayushshivhare351/Url-Shortener.git

cd Url-Shortener
```

---

## Backend

```bash
npm install
npm start
```

---

## Frontend

```bash
cd Frontend

npm install

npm run dev
```

---

# 🐳 Docker

Build and start the complete application

```bash
docker compose up --build
```

---

# 🔑 Environment Variables

Backend `.env`

```env
MONGODB_URI=

JWT_SECRET=

REDIS_URL=

BASE_URL=http://localhost:3000
```

Frontend `.env`

```env
VITE_API_URL=http://localhost:3000
```

---

# 📈 Analytics Included

✔ Daily Click Trends

✔ Browser Analytics

✔ Device Analytics

✔ Recent Activity

✔ Total Click Count

✔ Unique Visitors

---

# ⚡ Performance Optimizations

- Redis Caching
- Cached Redirects
- Cached Click Counters
- Rate Limiting
- MongoDB Indexing
- Lightweight REST APIs

---

# 🔒 Security

- JWT Authentication
- Password Hashing
- Protected Routes
- Rate Limiting
- Environment Variables
- Secure API Design

---

# 🚀 Future Improvements

- Link Expiration
- Password Protected URLs
- Public API
- Edit Existing Links
- Search & Filters
- Favorites
- Bulk URL Shortening

---

# 📜 License

This project is licensed under the MIT License.

---

<div align="center">

Built with ❤️ using React, Express, MongoDB, Redis & Docker.

</div>
