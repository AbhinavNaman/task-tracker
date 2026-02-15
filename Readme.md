
---

# 🧩 Task Tracker – Full Stack Application

This project consists of:

* **Backend**: Node.js + Express + MongoDB + Redis (Dockerized)
* **Frontend**: Next.js (runs locally)

---

# 📦 Project Structure

```
task-tracker/
│
├── backend/
│   ├── src/
│   ├── Dockerfile
|   └── docker-compose.yml
│   └── package.json
│
├── frontend/
│   ├── app/
│   └── package.json
```

---

# 🚀 Quick Start Guide

---

# 🐳 Start Backend (Using Docker)

The backend runs with:

* Express API
* MongoDB
* Redis

All handled automatically by Docker Compose.

---

## 1️⃣ Install Docker

Make sure you have:

* Docker Desktop installed
* Docker Compose enabled

Verify:

```bash
docker --version
docker compose version
```

---

## 2️⃣ Start Backend Services

From the **project root directory**:

```bash
docker compose up --build
```

This will start:

| Service     | Port                                           |
| ----------- | ---------------------------------------------- |
| Backend API | [http://localhost:5000](http://localhost:5000) |
| MongoDB     | 27017                                          |
| Redis       | 6379                                           |

No need to install MongoDB or Redis locally.

---

## 3️⃣ Verify Backend

Test health manually:

```bash
curl http://localhost:5000
```

Or test auth:

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'
```

---

## 4️⃣ Stop Backend

```bash
docker compose down
```

To remove volumes:

```bash
docker compose down -v
```

---

# 💻 Start Frontend (Locally)

The frontend runs separately using Next.js.

---

## 1️⃣ Navigate to Frontend

```bash
cd frontend
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 4️⃣ Run Frontend

```bash
npm run dev
```

Frontend will run at:

```
http://localhost:3000
```

---

# 🔄 Full Workflow

### Step 1

Start backend:

```bash
docker compose up
```

### Step 2

Start frontend:

```bash
cd frontend
npm run dev
```

### Step 3

Open browser:

```
http://localhost:3000
```

---

# 🧪 Running Backend Tests (Optional)

From `backend` folder:

```bash
npm run test -- --detectOpenHandles
```

---

# 🛑 Common Issues

### Backend container exits

Run:

```bash
docker compose logs backend
```

### Port already in use

Make sure ports 5000, 27017, and 6379 are free.

---

# ✅ Summary

* Backend → Docker
* MongoDB → Docker
* Redis → Docker
* Frontend → Local Next.js
* No local DB installation required

---
