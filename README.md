# 🔗 Scalable URL Shortener System

A scalable and high-performance URL Shortener built using Node.js, Express.js, MongoDB, Redis, and NanoID, with a React-based frontend.

This project demonstrates real-world system design concepts such as caching, efficient URL mapping, and low-latency redirection.

---

## 🚀 Features

- 🔗 Convert long URLs into short, shareable links  
- ⚡ Fast redirection using Redis caching  
- 📊 Click tracking and analytics  
- ⏳ URL expiration support  
- 🌐 RESTful API architecture  
- 💻 React-based frontend UI  
- 🔒 Secure APIs with CORS and rate limiting  

---

## 🛠 Tech Stack

**Backend:**
- Node.js  
- Express.js  

**Database:**
- MongoDB  

**Caching:**
- Redis  

**Frontend:**
- React.js  

**Utilities:**
- NanoID  
- CORS  

---

## ⚙️ System Design Overview

- Client sends a long URL → Backend API  
- Server generates a unique short ID using NanoID  
- Mapping is stored in MongoDB  
- Frequently accessed URLs are cached in Redis ⚡  
- On request, system checks Redis → fallback to DB → redirects user  

---

## 📡 API Endpoints

### 🔹 Create Short URL
POST /api/shorten

### 🔹 Redirect to Original URL
GET /:shortId

### 🔹 Get Analytics
GET /api/analytics/:shortId

---

## 🚀 Getting Started

### 1️⃣ Clone the repository
git clone https://github.com/your-username/url-shortener.git  
cd url-shortener  

### 2️⃣ Install dependencies
npm install  

### 3️⃣ Setup environment variables

Create a `.env` file:

PORT=5000  
MONGO_URI=your_mongodb_connection  
REDIS_URL=your_redis_connection  
BASE_URL=http://localhost:5000  

### 4️⃣ Run the server
npm start  

---

## 💻 Frontend Setup

cd client  
npm install  
npm start  

---

## 📊 Key Learnings

- Built a scalable backend system  
- Implemented caching using Redis  
- Designed REST APIs using Express.js  
- Managed database operations with MongoDB  
- Integrated frontend with backend  
- Improved debugging and problem-solving skills  

---

## 📈 Future Improvements

- 🔐 Authentication & user accounts  
- 🌍 Custom domain support  
- 📊 Advanced analytics dashboard  
- 📦 Docker & CI/CD integration  

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork and improve the project.

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub!
