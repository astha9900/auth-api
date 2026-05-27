# 🔐 Auth API

A production-ready **JWT Authentication API** built with Node.js, Express, Prisma ORM, and PostgreSQL. Features secure registration, login, token refresh, and profile management.

## 🌐 Live Demo

**Frontend:** [https://auth-frontend-inky.vercel.app](https://auth-frontend-inky.vercel.app)
**API:** [https://deploy-auth-nine.vercel.app](https://deploy-auth-nine.vercel.app)

> Demo credentials: `demo@authvault.app` / `Demo1234!`

## ✨ Features

- **JWT Authentication** — Access tokens (15min) + refresh tokens (7 days)
- **Secure Passwords** — bcrypt hashing with salt rounds
- **Rate Limiting** — 5 login attempts per 15 minutes
- **Input Validation** — Zod schema validation
- **Security Headers** — Helmet.js middleware
- **PostgreSQL** — Neon serverless database with Prisma ORM

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| ORM | Prisma |
| Database | PostgreSQL (Neon) |
| Auth | JWT (jsonwebtoken) |
| Validation | Zod |
| Security | Helmet, bcryptjs, express-rate-limit |

## 📡 API Endpoints

```
POST   /api/auth/register    Register a new user
POST   /api/auth/login       Login and receive tokens
POST   /api/auth/refresh     Refresh access token
GET    /api/users/profile    Get current user profile (authenticated)
```

## 🚀 Quick Start

```bash
git clone https://github.com/astha9900/auth-api.git
cd auth-api
npm install
cp .env.example .env   # Add DATABASE_URL and JWT secrets
npx prisma db push
npm run dev
```

## 📦 Environment Variables

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
PORT=4000
NODE_ENV=development
```

---

Made with ❤️ by **Astha Bharti**
