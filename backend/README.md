# Research Paper Reading Tracker — Backend

A professional REST API built with **Node.js**, **Express**, and **MongoDB** for the Research Paper Reading Tracker application.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express 4 |
| Database | MongoDB + Mongoose |
| Auth | JWT (access + refresh tokens) |
| Validation | Joi |
| Security | Helmet, express-mongo-sanitize, CORS |
| Rate Limiting | express-rate-limit |
| Logging | Winston + Morgan |

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js       # MongoDB connection
│   │   └── logger.js         # Winston logger
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── paper.controller.js
│   │   └── analytics.controller.js
│   ├── middleware/
│   │   ├── authenticate.js   # JWT guard
│   │   ├── errorHandler.js   # Centralized error handling + AppError class
│   │   ├── notFound.js       # 404 handler
│   │   ├── rateLimiter.js    # Global + auth rate limiters
│   │   └── validate.js       # Joi validation factory
│   ├── models/
│   │   ├── user.model.js
│   │   └── paper.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── paper.routes.js
│   │   └── analytics.routes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── paper.service.js
│   │   └── analytics.service.js
│   ├── validators/
│   │   ├── auth.validator.js
│   │   └── paper.validator.js
│   └── app.js
├── server.js
├── .env.example
└── package.json
```

---

## Getting Started

### 1. Clone & Install

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Run

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

Server starts on `http://localhost:5000`

---

## API Reference

### Base URL
```
/api/v1
```

### Auth Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login |
| POST | `/auth/refresh-token` | ❌ | Refresh access token |
| GET | `/auth/me` | ✅ | Get current user |
| PATCH | `/auth/change-password` | ✅ | Change password |

#### Register
```json
POST /api/v1/auth/register
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecurePass1!",
  "confirmPassword": "SecurePass1!"
}
```

#### Login
```json
POST /api/v1/auth/login
{
  "email": "jane@example.com",
  "password": "SecurePass1!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "Jane Doe", "email": "jane@example.com" },
    "tokens": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ..."
    }
  }
}
```

---

### Paper Endpoints

All require `Authorization: Bearer <accessToken>` header.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/papers` | List papers (filterable, paginated) |
| POST | `/papers` | Add a new paper |
| GET | `/papers/:id` | Get single paper |
| PATCH | `/papers/:id` | Update paper |
| DELETE | `/papers/:id` | Delete paper |

#### Add Paper
```json
POST /api/v1/papers
{
  "paperTitle": "Attention Is All You Need",
  "firstAuthorName": "Ashish Vaswani",
  "researchDomain": "Computer Science",
  "readingStage": "Fully Read",
  "citationCount": 95000,
  "impactScore": "High Impact",
  "dateAdded": "2024-03-01"
}
```

#### Filter Papers (Query Params)

| Param | Type | Options |
|---|---|---|
| `readingStage` | string or string[] | Abstract Read, Introduction Done, Methodology Done, Results Analyzed, Fully Read, Notes Completed |
| `researchDomain` | string or string[] | Computer Science, Biology, Physics, Chemistry, Mathematics, Social Sciences |
| `impactScore` | string or string[] | High Impact, Medium Impact, Low Impact, Unknown |
| `dateRange` | string | `this_week`, `this_month`, `last_3_months`, `all_time` |
| `page` | number | default: 1 |
| `limit` | number | default: 20, max: 100 |
| `sortBy` | string | `dateAdded`, `citationCount`, `paperTitle` |
| `sortOrder` | string | `asc`, `desc` |

```
GET /api/v1/papers?readingStage=Fully Read&readingStage=Abstract Read&dateRange=this_month
```

---

### Analytics Endpoints

All require authentication.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/analytics` | All analytics (single round-trip) |
| GET | `/analytics/funnel` | Reading stage funnel |
| GET | `/analytics/scatter` | Citation vs Impact scatter data |
| GET | `/analytics/domain-matrix` | Domain × Reading Stage stacked bar data |
| GET | `/analytics/summary` | Summary stats |

#### Combined Analytics Response
```json
{
  "success": true,
  "data": {
    "funnel": [
      { "stage": "Abstract Read", "count": 12 },
      { "stage": "Fully Read", "count": 5 }
    ],
    "scatterPlot": [
      { "id": "...", "title": "...", "citationCount": 500, "impactScore": "High Impact", "domain": "Computer Science" }
    ],
    "domainMatrix": [
      {
        "domain": "Computer Science",
        "stages": [
          { "stage": "Abstract Read", "count": 3 },
          { "stage": "Fully Read", "count": 2 }
        ]
      }
    ],
    "summary": {
      "total": 25,
      "fullyRead": 5,
      "completionRate": 20.0,
      "papersByStage": [...],
      "avgCitationsPerDomain": [...]
    }
  }
}
```

---

## Security Features

- **Helmet** — Sets secure HTTP headers
- **CORS** — Allowlist-based origin control
- **express-mongo-sanitize** — Prevents NoSQL injection
- **Rate limiting** — 100 req/15min globally; 10 req/15min on auth routes
- **JWT** — Short-lived access tokens (7d) + long-lived refresh tokens (30d)
- **bcryptjs** — Password hashing with cost factor 12
- **Body size limit** — 10kb max payload
- **Password change invalidation** — Tokens issued before password change are rejected

---

## Error Response Format

```json
{
  "success": false,
  "message": "Human-readable error message"
}
```

| Status | Meaning |
|---|---|
| 400 | Bad request / invalid ID |
| 401 | Unauthenticated |
| 404 | Not found |
| 409 | Conflict (duplicate email) |
| 422 | Validation error |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
