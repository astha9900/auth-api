# 🔐 Auth API — Production-Ready REST API

A secure, scalable REST API with JWT authentication, role-based access control (RBAC), rate limiting, and PostgreSQL. Built for real-world use — not just a tutorial.

## ✨ Features

- **JWT Auth** — Access tokens (15m) + Refresh tokens (7d) with rotation
- **RBAC** — Role-based access control: `admin`, `user`, `guest`
- **Rate Limiting** — Per-IP rate limits to prevent brute force
- **Input Validation** — Zod schema validation on all endpoints
- **Security Headers** — Helmet.js for XSS, CSRF, and content-type protections
- **Logging** — Morgan HTTP logs + Winston error logs
- **Swagger Docs** — Auto-generated API documentation at `/api-docs`
- **Dockerized** — One command to spin up API + PostgreSQL

## 🛠️ Tech Stack

Node.js · Express.js · PostgreSQL · Prisma ORM · JWT · bcrypt · Zod · Helmet · Winston · Docker

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/astha9900/auth-api.git
cd auth-api

# Install
npm install

# Configure
cp .env.example .env

# Migrate DB & start
npx prisma migrate dev
npm run dev
```

**Or with Docker:**
```bash
docker-compose up
```

## 📡 API Reference

### Auth Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | None | Register new user |
| POST | `/api/auth/login` | None | Login, receive tokens |
| POST | `/api/auth/refresh` | Refresh token | Rotate access token |
| POST | `/api/auth/logout` | Bearer | Revoke refresh token |
| GET | `/api/auth/me` | Bearer | Get current user |

### User Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/users` | Admin | List all users |
| GET | `/api/users/:id` | Bearer | Get user by ID |
| PATCH | `/api/users/:id` | Bearer (owner/admin) | Update user |
| DELETE | `/api/users/:id` | Admin | Delete user |

### Response Format

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

Error:
```json
{
  "success": false,
  "error": "Validation error",
  "details": [{ "field": "email", "message": "Invalid email" }]
}
```

## 🔒 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens signed with HS256
- Refresh tokens stored hashed in DB (rotation + revocation)
- Rate limiting: 100 req/15min globally, 5 req/15min on auth routes
- All inputs validated with Zod before hitting business logic

## 🧪 Testing

```bash
npm test          # Run all tests
npm run test:cov  # Coverage report
```

## 🐳 Docker

```bash
docker-compose up     # Start API + PostgreSQL
docker-compose down   # Stop containers
```

## 📄 Environment Variables

```env
DATABASE_URL=postgresql://user:password@localhost:5432/authdb
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
PORT=4000
NODE_ENV=development
```

## 📖 API Docs

Run the server and visit: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)

## 📄 License

MIT © [Astha Bharti](https://github.com/astha9900)
