# Signup request
```
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'
```

# signup response
```
{"user":{"name":"Test","email":"test@test.com","password":"$2b$10$E4ATDddkyxOn9.q98NiWFefl//cLk6kLKjWAR6V7bK1iPpwk.UfBG","_id":"6990d21600e4ecd57539e44b","createdAt":"2026-02-14T19:50:46.957Z","__v":0},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTkwZDIxNjAwZTRlY2Q1NzUzOWU0NGIiLCJpYXQiOjE3NzEwOTg2NDYsImV4cCI6MTc3MTcwMzQ0Nn0.z_lDNTTfPO5hlodjo6BrUkFDmj1trBRn1Liu6npXyoI"}
```

# login request
```
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

# login response 
```
{"user":{"_id":"6990d21600e4ecd57539e44b","name":"Test","email":"test@test.com","password":"$2b$10$E4ATDddkyxOn9.q98NiWFefl//cLk6kLKjWAR6V7bK1iPpwk.UfBG","createdAt":"2026-02-14T19:50:46.957Z","__v":0},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTkwZDIxNjAwZTRlY2Q1NzUzOWU0NGIiLCJpYXQiOjE3NzEwOTg3NTksImV4cCI6MTc3MTcwMzU1OX0.lqcH4ug5vjbhq7CZBpNKBeJepGQ6kE55zB9CZVwUlKs"}
```


---

# 🔐 0️⃣ First: Store the JWT Token

From your login response, copy the token:

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTkwZDIxNjAwZTRlY2Q1NzUzOWU0NGIiLCJpYXQiOjE3NzEwOTg3NTksImV4cCI6MTc3MTcwMzU1OX0.lqcH4ug5vjbhq7CZBpNKBeJepGQ6kE55zB9CZVwUlKs"
```

⚠️ Every task API **requires this token**.

---

# 📋 1️⃣ CREATE TASK

### Endpoint

```
POST /api/tasks
```

### Curl

```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Finish assignment",
    "description": "Complete backend task tracker",
    "dueDate": "2026-02-20T18:30:00.000Z"
  }'
```

### Expected Response

```json
{
  "_id": "6990d3...",
  "title": "Finish assignment",
  "description": "Complete backend task tracker",
  "status": "pending",
  "owner": "6990d21600e4ecd57539e44b",
  "createdAt": "2026-02-14T19:55:00.000Z"
}
```

📌 Copy the returned `_id` — we’ll use it below.

---

# 📄 2️⃣ GET TASKS (Basic)

### Endpoint

```
GET /api/tasks
```

### Curl

```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer $TOKEN"
```

### Expected Response

```json
{
  "data": [...],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

This response may be **cached via Redis**.

---

# 📊 3️⃣ GET TASKS — Pagination

```bash
curl -X GET "http://localhost:5000/api/tasks?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN"
```

---

# 🔍 4️⃣ GET TASKS — Filter by Status

```bash
curl -X GET "http://localhost:5000/api/tasks?status=pending" \
  -H "Authorization: Bearer $TOKEN"
```

Try:

```bash
status=completed
```

---

# 📅 5️⃣ GET TASKS — Filter by Due Date

```bash
curl -X GET "http://localhost:5000/api/tasks?dueBefore=2026-02-21" \
  -H "Authorization: Bearer $TOKEN"
```

---

# ✏️ 6️⃣ UPDATE TASK

### Endpoint

```
PUT /api/tasks/:id
```

### Curl

```bash
curl -X PUT http://localhost:5000/api/tasks/TASK_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Finish assignment (updated)",
    "status": "completed"
  }'
```

### Expected Response

```json
{
  "_id": "TASK_ID_HERE",
  "title": "Finish assignment (updated)",
  "status": "completed"
}
```

📌 This **invalidates Redis cache** automatically.

---

# ❌ 7️⃣ DELETE TASK

### Endpoint

```
DELETE /api/tasks/:id
```

### Curl

```bash
curl -X DELETE http://localhost:5000/api/tasks/TASK_ID_HERE \
  -H "Authorization: Bearer $TOKEN"
```

### Expected Response

```
HTTP/1.1 204 No Content
```

---

# 🚫 8️⃣ UNAUTHORIZED ACCESS (Negative Test)

```bash
curl -X GET http://localhost:5000/api/tasks
```

Expected:

```json
{
  "message": "Unauthorized"
}
```

This proves auth middleware works.

---

# 🧪 9️⃣ INVALID TASK ID (404 Test)

```bash
curl -X PUT http://localhost:5000/api/tasks/64f000000000000000000000 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Invalid"}'
```

Expected:

```json
{
  "message": "Task not found"
}
```

---

# 🔄 10️⃣ REDIS CACHE TEST (Optional but Cool)

Run this twice:

```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer $TOKEN"
```

Second request should be served from **Redis** (check logs).

Then create/update/delete a task and run GET again → cache is invalidated.

---

# ✅ FULL API CHECKLIST (For README)

| Method | Endpoint         | Description        |
| ------ | ---------------- | ------------------ |
| POST   | /api/auth/signup | Register user      |
| POST   | /api/auth/login  | Login user         |
| GET    | /api/tasks       | Get tasks (cached) |
| POST   | /api/tasks       | Create task        |
| PUT    | /api/tasks/:id   | Update task        |
| DELETE | /api/tasks/:id   | Delete task        |

---

