<![CDATA[# 🧱 Weinix Backend — CRM + Customer Portal API

> **Scalable Node.js/Express backend** for the Weinix sustainable-brick e-commerce platform.
> Handles admin CRM operations (users, customers, products, tickets, audits) **and** a customer-facing self-service portal — all behind JWT-based, Redis-backed session management.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Models](#database-models)
- [Middleware](#middleware)
- [Standard API Response Format](#standard-api-response-format)
- [Health Check Endpoints](#health-check-endpoints)
- [Admin Routes](#admin-routes)
  - [Auth Routes](#1-auth-routes)
  - [Customer Routes (Admin)](#2-customer-routes-admin)
  - [Product Routes](#3-product-routes)
  - [Ticket Routes (Admin)](#4-ticket-routes-admin)
  - [Audit Routes](#5-audit-routes)
- [Customer / Public Routes](#customer--public-routes)
  - [Customer Self-Serve Routes](#6-customer-self-serve-routes)
  - [Product Public Routes](#7-product-public-routes)
  - [Ticket Customer Routes](#8-ticket-customer-routes)
- [Portal Routes (Customer Portal)](#portal-routes-customer-portal)
  - [Portal Auth](#9-portal-auth-routes)
  - [Portal Tickets](#10-portal-ticket-routes)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [Audit Logging](#audit-logging)
- [Notifications](#notifications)
- [Scripts](#scripts)
- [License](#license)

---

## Project Overview

Weinix Backend is a **dual-audience API server**:

| Audience | Base Path | Auth Method |
|---|---|---|
| **Admin CRM** (superadmin / admin) | `/api/v1/admin/*` | JWT Bearer — `authenticate` + `authorize` middleware |
| **Public / Customer self-serve** | `/api/v1/customers/*`, `/api/v1/products/*` | Some routes public, some require customerId |
| **Customer Portal** | `/api/v1/portal/*` | JWT Bearer — `requireCustomerAuth` middleware |

Key features:
- 🔐 **JWT access + refresh tokens** with Redis-backed sessions
- 📱 **OTP authentication** via WhatsApp (HSNS microservice) for both admins and customers
- 🎫 **Ticketing system** with real-time message threads, assignment, and auto-status transitions
- 🧱 **Product catalog** with multi-variant support (design, material, pricing, sustainability)
- 📋 **Full audit trail** with 90-day TTL auto-cleanup
- 🚦 **Rate limiting** (API-global, auth-specific, OTP-specific)
- 🔔 **Notifications** via WhatsApp + Email on all critical events

---

## Tech Stack

| Component | Technology | Version |
|---|---|---|
| Runtime | Node.js | ≥ 18.0.0 |
| Framework | Express.js | ^4.18.2 |
| Database | MongoDB (Mongoose) | ^8.0.3 |
| Cache / Sessions | Redis | ^4.6.12 |
| Auth | JSON Web Tokens | ^9.0.2 |
| Password Hashing | bcryptjs | ^2.4.3 |
| Validation | Joi | ^17.11.0 |
| Security | Helmet, CORS, express-rate-limit, express-mongo-sanitize | — |
| Logging | Winston + Morgan | — |
| HTTP Client | Axios (for HSNS) | ^1.6.5 |
| Dev Server | Nodemon | ^3.0.2 |
| Tests | Jest | ^29.7.0 |

---

## Project Structure

```
weinix_backend/
├── app.js                          # Express app setup, middleware, route mounts
├── server.js                       # Server bootstrap (DB + Redis connect, listen)
├── jwtService.js                   # JWT token issuance, session management
├── package.json
├── .env                            # Environment configuration
├── .gitignore
└── src/
    ├── config/
    │   ├── database.js             # MongoDB connection (Mongoose)
    │   └── redis.js                # Redis client singleton
    ├── controllers/
    │   ├── admin/
    │   │   ├── authController.js   # Admin auth (login, register, OTP, sessions, password)
    │   │   ├── customerController.js # Customer CRUD (admin + self-serve)
    │   │   ├── productController.js  # Product CRUD
    │   │   ├── ticketController.js   # Ticket management (admin side)
    │   │   └── auditController.js    # Audit log queries
    │   └── portal/
    │       └── portalController.js   # Customer portal (auth + tickets)
    ├── middleware/
    │   ├── auth.js                 # authenticate, authorize, optionalAuth
    │   ├── customerAuth.js         # requireCustomerAuth (portal JWT)
    │   ├── auditMiddleware.js      # Auto-audit on response
    │   ├── errorHandler.js         # Global error handler + 404
    │   ├── rateLimiter.js          # apiLimiter, authLimiter, otpLimiter
    │   └── validator.js            # Joi schema validation wrapper
    ├── models/
    │   ├── User.js                 # Admin/Superadmin model
    │   ├── Customer.js             # Customer model
    │   ├── Product.js              # Product + Variant model
    │   ├── Ticket.js               # Ticket + Message model
    │   ├── Audit.js                # Audit log model (90-day TTL)
    │   └── Analytics.js            # Analytics model
    ├── routes/
    │   ├── authRoutes.js           # /api/v1/admin/auth/*
    │   ├── customerRoutes.js       # /api/v1/admin/customers/*
    │   ├── productRoutes.js        # /api/v1/products/*
    │   ├── ticketRoutes.js         # /api/v1/admin/tickets/*
    │   ├── auditRoutes.js          # /api/v1/admin/audits/*
    │   └── portal/
    │       └── portalRoutes.js     # /api/v1/portal/*
    ├── services/
    │   ├── auditService.js         # Audit log creation + queries
    │   ├── auth/                   # JWT service
    │   └── notification/           # HSNS (WhatsApp + Email)
    ├── utils/
    │   ├── apiResponse.js          # Standardised JSON response helper
    │   └── logger.js               # Winston logger config
    └── validators/
        └── authValidators.js       # Joi schemas (login, createAdmin, verifyOTP)
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.0.0
- **MongoDB** (Atlas or local)
- **Redis** (Cloud or local)

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd weinix_backend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env   # Edit .env with your secrets

# Seed the superadmin account
npm run seed

# Start development server
npm run dev

# Start production server
npm start
```

### Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `nodemon server.js` | Start with auto-reload |
| `start` | `node server.js` | Production start |
| `seed` | `node scripts/seedSuperAdmin.js` | Create initial superadmin |
| `test` | `jest --coverage` | Run tests |

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `8080` |
| `API_VERSION` | API version prefix | `v1` |
| `MONGODB_URI` | MongoDB connection string | — |
| `REDIS_HOST` | Redis hostname | — |
| `REDIS_PORT` | Redis port | — |
| `REDIS_USERNAME` | Redis username | `default` |
| `REDIS_PASSWORD` | Redis password | — |
| `JWT_SECRET` | Access token secret | — |
| `JWT_EXPIRES_IN` | Access token TTL | `30d` |
| `JWT_REFRESH_SECRET` | Refresh token secret | — |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL | `60d` |
| `OTP_EXPIRY_MINUTES` | OTP lifetime | `10` |
| `HSNS_BASE_URL` | Notification service URL | — |
| `HSNS_API_KEY` | Notification service key | — |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `http://localhost:3000` |
| `RATE_LIMIT_WINDOW_MS` | Global rate-limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `1000000` |
| `SUPERADMIN_USERNAME` | Seed superadmin userId | — |
| `SUPERADMIN_PASSWORD` | Seed superadmin password | — |
| `SUPERADMIN_EMAIL` | Seed superadmin email | — |
| `SUPERADMIN_PHONE` | Seed superadmin phone | — |
| `MAX_FILE_SIZE` | Max upload size (bytes) | `5242880` (5 MB) |
| `ANALYTICS_RETENTION_DAYS` | Analytics data retention | `90` |
| `SESSION_TIMEOUT_MINUTES` | Session inactivity timeout | `30` |

---

## Database Models

### User (Admin/Superadmin)

| Field | Type | Notes |
|---|---|---|
| `userId` | String | Unique, indexed, required |
| `password` | String | Bcrypt-hashed (salt 12), min 8 chars |
| `role` | Enum | `superadmin` \| `admin` |
| `profile.name` | String | Required |
| `profile.email` | String | Unique, lowercase |
| `profile.phone` | String | Unique |
| `profile.isEmailVerified` | Boolean | Default `false` |
| `profile.isPhoneVerified` | Boolean | Default `false` |
| `status` | Enum | `active` \| `inactive` \| `suspended` |
| `lastLogin` | Date | — |
| `loginAttempts` | Number | Auto-lock after 5 (2 hr lockout) |
| `lockUntil` | Date | — |
| `createdBy` | ObjectId → User | — |
| `passwordChangedAt` | Date | — |
| `timestamps` | — | `createdAt`, `updatedAt` |

### Customer

| Field | Type | Notes |
|---|---|---|
| `phone` | String | Unique, indexed, required |
| `isPhoneVerified` | Boolean | Default `false` |
| `profile.name` | String | — |
| `profile.email` | String | — |
| `profile.company` | String | — |
| `profile.businessType` | Enum | `b2b` \| `d2c` \| `both` |
| `profile.address` | Object | `street`, `city`, `state`, `country`, `pincode` |
| `profile.gstNumber` | String | Indian GST format validated |
| `preferences.interestedProducts` | [ObjectId → Product] | — |
| `preferences.communicationChannel` | Enum | `whatsapp` \| `sms` \| `email` \| `all` |
| `activityLog` | Array | Last 100 entries (auto-trimmed) |
| `status` | Enum | `active` \| `inactive` \| `blocked` |
| `lastActive` | Date | — |

### Product

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required, text-indexed |
| `slug` | String | Unique, lowercase |
| `category` | Enum | `brick` \| `sheet` \| `tile` \| `panel` |
| `description.short` | String | Max 200 chars |
| `description.long` | String | — |
| `story` | String | Brand story |
| `stance` | String | Brand stance |
| `variants[]` | Array | See Variant sub-schema below |
| `tags` | [String] | Indexed |
| `status` | Enum | `active` \| `inactive` \| `discontinued` |
| `analytics` | Object | `views`, `clicks`, `inquiries` |
| `seo` | Object | `metaTitle`, `metaDescription`, `keywords[]` |
| `createdBy` / `updatedBy` | ObjectId → User | — |

**Variant sub-schema:** `design`, `material`, `article`, `images` (withBacklit/withoutBacklit), `pricing` (unit/pricePerUnit/currency/bulkDiscounts), `specifications` (dimensions/weight/finish/sustainability), `availability` (inStock/stockQuantity/productionTimeline), `sku`.

### Ticket

| Field | Type | Notes |
|---|---|---|
| `ticketId` | String | Auto-generated `TKT-YYYYMM-000001` |
| `customer` | ObjectId → Customer | Required |
| `type` | Enum | `sales` \| `support` \| `inquiry` \| `complaint` |
| `businessType` | Enum | `b2b` \| `d2c` |
| `subject` | String | Required |
| `priority` | Enum | `low` \| `medium` \| `high` \| `urgent` |
| `status` | Enum | `open` \| `in_progress` \| `awaiting_customer` \| `awaiting_staff` \| `resolved` \| `closed` |
| `messages[]` | Array | `sender` (customer/admin/rag), `senderId`, `senderModel`, `message`, `attachments`, `timestamp`, `isRead` |
| `assignedTo` | ObjectId → User | — |
| `productInterest[]` | Array | `productId`, `variantSku`, `quantity`, `notes` |
| `ragHandled` | Boolean | Default `true` |
| `requiresHumanIntervention` | Boolean | Default `false` |
| `resolution` | Object | `resolvedAt`, `resolvedBy`, `resolutionNotes`, `customerSatisfaction` |
| `closedAt` / `closedBy` | Date / ObjectId | — |

### Audit

| Field | Type | Notes |
|---|---|---|
| `user` | ObjectId → User | Who performed the action |
| `action` | String | e.g. `create`, `login`, `status_change` |
| `resource` | Enum | `product` \| `ticket` \| `user` \| `customer` \| `auth` |
| `resourceId` | ObjectId | Target resource |
| `details` | Mixed | Action-specific metadata |
| `changes` | Object | `before` / `after` snapshots |
| `metadata` | Object | `ipAddress`, `userAgent`, `method`, `path`, `statusCode` |
| `timestamp` | Date | **TTL: 90 days** (auto-deleted) |

---

## Middleware

| Middleware | File | Description |
|---|---|---|
| `authenticate` | `auth.js` | Validates JWT Bearer token + Redis session + active user status |
| `authorize(...roles)` | `auth.js` | Checks `req.user.role` against allowed roles |
| `optionalAuth` | `auth.js` | Like `authenticate` but silently skips if no token |
| `requireCustomerAuth` | `customerAuth.js` | Portal JWT auth — sets `req.customer` + `req.session` |
| `validate(schema)` | `validator.js` | Runs Joi schema validation on `req.body` |
| `auditMiddleware(action, resource)` | `auditMiddleware.js` | Auto-logs audit entry after successful response |
| `authLimiter` | `rateLimiter.js` | 15 req / 15 min (skips successful), auth endpoints |
| `otpLimiter` | `rateLimiter.js` | 3 req / 1 hour, keyed by phone/email/IP |
| `apiLimiter` | `rateLimiter.js` | Global API rate limit (configurable via env) |
| `helmet` | Express | Security headers |
| `compression` | Express | Gzip responses |
| `cors` | Express | Configured via `ALLOWED_ORIGINS` |
| `errorHandler` | `errorHandler.js` | Catches ValidationError, CastError, duplicate key, JWT errors |
| `notFound` | `errorHandler.js` | 404 catch-all |

---

## Standard API Response Format

All endpoints return a consistent JSON envelope:

### Success Response

```json
{
  "success": true,
  "message": "Descriptive message",
  "data": { ... },
  "timestamp": "2026-03-10T16:55:00.000Z"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": null,
  "timestamp": "2026-03-10T16:55:00.000Z"
}
```

### HTTP Status Codes Used

| Code | Meaning | Helper Method |
|---|---|---|
| `200` | Success | `ApiResponse.success()` |
| `201` | Created | `ApiResponse.success(res, data, msg, 201)` |
| `400` | Bad Request / Validation | `ApiResponse.error()` / `ApiResponse.validationError()` |
| `401` | Unauthorized | `ApiResponse.unauthorized()` |
| `403` | Forbidden | `ApiResponse.forbidden()` |
| `404` | Not Found | `ApiResponse.notFound()` |
| `409` | Conflict (duplicate) | `ApiResponse.error(res, msg, 409)` |
| `423` | Locked (account) | `ApiResponse.error(res, msg, 423)` |
| `429` | Too Many Requests | Rate limiter auto-response |
| `500` | Internal Server Error | `ApiResponse.error()` |

---

## Health Check Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | None | Server health + uptime |
| `GET` | `/health/redis` | None | Redis ping |
| `GET` | `/health/mongodb` | None | MongoDB admin ping |

**Response (`/health`):**
```json
{
  "success": true,
  "message": "Weinix Backend Healthy",
  "timestamp": "...",
  "uptime": 12345.67,
  "env": "development"
}
```

---

## Admin Routes

> **Base path:** `/api/v1/admin/auth`, `/api/v1/admin/customers`, `/api/v1/admin/tickets`, `/api/v1/admin/audits`
> **Authentication:** JWT Bearer token via `Authorization: Bearer <accessToken>` header

---

### 1. Auth Routes

**Mount:** `/api/v1/admin/auth`

#### 1.1 `POST /login` — Admin Login

| | Details |
|---|---|
| **Auth** | 🔓 Public |
| **Rate Limit** | `authLimiter` (15 req / 15 min) |
| **Validation** | `loginSchema` (Joi) |

**Request Body:**
```json
{
  "userId": "string (required, trimmed)",
  "password": "string (required, min 8 chars)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "userId": "vansh",
      "name": "Vansh Khatri",
      "email": "khatri@weinix.com",
      "role": "superadmin"
    },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi...",
    "sessionId": "uuid-session-id",
    "expiresIn": "30d"
  }
}
```

**Error Responses:**
- `401` — Invalid credentials
- `403` — Account not active / Email or phone not verified
- `423` — Account locked (after 5 failed attempts, 2 hr lockout)

**Side Effects:** Email + WhatsApp login alert sent. Audit log created.

---

#### 1.2 `POST /refresh` — Refresh Access Token

| | Details |
|---|---|
| **Auth** | 🔓 Public |

**Request Body:**
```json
{
  "refreshToken": "string (required)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "eyJhbGciOi...",
    "sessionId": "uuid-session-id"
  }
}
```

---

#### 1.3 `POST /verify-email` — Verify Admin Email OTP

| | Details |
|---|---|
| **Auth** | 🔓 Public |
| **Rate Limit** | `otpLimiter` (3 req / 1 hr) |

**Request Body:**
```json
{
  "email": "string (required)",
  "otp": "string (required)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "emailVerified": true,
    "phoneVerified": false,
    "accountActive": false
  }
}
```

---

#### 1.4 `POST /verify-phone` — Verify Admin Phone OTP

| | Details |
|---|---|
| **Auth** | 🔓 Public |
| **Rate Limit** | `otpLimiter` (3 req / 1 hr) |

**Request Body:**
```json
{
  "phone": "string (required)",
  "otp": "string (required)"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Phone verified successfully",
  "data": {
    "emailVerified": true,
    "phoneVerified": true,
    "accountActive": true
  }
}
```

> **Note:** Account becomes `active` only after **both** email and phone are verified.

---

#### 1.5 `GET /me` — Get Current Admin Profile

| | Details |
|---|---|
| **Auth** | 🔒 `authenticate` |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile fetched",
  "data": {
    "userId": "vansh",
    "name": "Vansh Khatri",
    "email": "khatri@weinix.com",
    "phone": "7300788546",
    "role": "superadmin",
    "status": "active",
    "lastLogin": "2026-03-10T12:00:00.000Z",
    "emailVerified": true,
    "phoneVerified": true
  }
}
```

---

#### 1.6 `GET /sessions` — Get My Active Sessions

| | Details |
|---|---|
| **Auth** | 🔒 `authenticate` |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Sessions fetched",
  "data": {
    "sessions": [
      {
        "sessionId": "uuid",
        "createdAt": "...",
        "lastActivity": "...",
        "ipAddress": "127.0.0.1",
        "userAgent": "Mozilla/5.0..."
      }
    ]
  }
}
```

---

#### 1.7 `POST /logout` — Logout Current Session

| | Details |
|---|---|
| **Auth** | 🔒 `authenticate` |

**Request Body:** _None_

**Success Response (200):**
```json
{ "success": true, "message": "Logged out successfully", "data": null }
```

**Side Effects:** Session destroyed in Redis. Email alert sent. Audit logged.

---

#### 1.8 `POST /logout-all` — Logout All Sessions

| | Details |
|---|---|
| **Auth** | 🔒 `authenticate` |

**Request Body:** _None_

**Success Response (200):**
```json
{ "success": true, "message": "Logged out from all devices", "data": null }
```

---

#### 1.9 `POST /change-password` — Change Own Password

| | Details |
|---|---|
| **Auth** | 🔒 `authenticate` |

**Request Body:**
```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (required)"
}
```

**Success Response (200):**
```json
{ "success": true, "message": "Password changed. Please login again.", "data": null }
```

**Side Effects:** All sessions destroyed. Email + WhatsApp notification sent.

---

#### 1.10 `POST /forgot-password` — Request Password Reset Link

| | Details |
|---|---|
| **Auth** | 🔓 Public |
| **Rate Limit** | `authLimiter` |

**Request Body:**
```json
{
  "identifier": "string (required — userId or email)"
}
```

**Success Response (200):**
```json
{ "success": true, "message": "If an account exists for this identifier, a reset link has been sent", "data": null }
```

**Side Effects:** Reset link sent via Email + WhatsApp. Token stored in Redis (15 min TTL).

---

#### 1.11 `POST /reset-password` — Reset Password with Token

| | Details |
|---|---|
| **Auth** | 🔓 Public |
| **Rate Limit** | `authLimiter` |

**Request Body:**
```json
{
  "tokenId": "string (required — from reset link)",
  "newPassword": "string (required)"
}
```

**Success Response (200):**
```json
{ "success": true, "message": "Password reset successful. Please login with your new password.", "data": null }
```

**Side Effects:** All sessions destroyed. Redis token deleted. Email + WhatsApp notification.

---

#### 1.12 `POST /register` — Register New Admin 🔑 **Superadmin Only**

| | Details |
|---|---|
| **Auth** | 🔒 `authenticate` + `authorize('superadmin')` |
| **Validation** | `createAdminSchema` (Joi) |

**Request Body:**
```json
{
  "userId": "string (required, alphanumeric, 4-30 chars)",
  "password": "string (required, min 8, must have upper+lower+digit+special)",
  "name": "string (required, 2-100 chars)",
  "email": "string (required, valid email)",
  "phone": "string (required, E.164 format)",
  "role": "string (optional, default: 'admin')"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Admin created. OTPs sent to email and phone for verification.",
  "data": {
    "userId": "newadmin",
    "email": "admin@weinix.com",
    "phone": "+919999999999",
    "requiresVerification": true
  }
}
```

**Side Effects:** OTPs sent to email and WhatsApp. New admin starts as `inactive` until both are verified.

---

#### 1.13 `GET /check-userid/:userId` — Check UserId Availability 🔑 **Superadmin Only**

| | Details |
|---|---|
| **Auth** | 🔒 `authenticate` + `authorize('superadmin')` |
| **Rate Limit** | `authLimiter` |

**URL Params:** `userId` — the userId to check

**Success Response (200):**
```json
{
  "success": true,
  "message": "UserId availability checked",
  "data": {
    "userId": "newadmin",
    "isAvailable": true,
    "message": "userId \"newadmin\" is available"
  }
}
```

---

#### 1.14 `GET /admins` — Get All Admins 🔑 **Superadmin Only**

| | Details |
|---|---|
| **Auth** | 🔒 `authenticate` + `authorize('superadmin')` |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Admins fetched",
  "data": {
    "admins": [
      {
        "userId": "admin1",
        "role": "admin",
        "profile": { "name": "...", "email": "...", "phone": "..." },
        "status": "active",
        "createdBy": { "userId": "vansh", "profile": { "name": "..." } },
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
}
```

---

#### 1.15 `GET /admins/:userId/sessions` — Get Admin's Sessions 🔑 **Superadmin Only**

| | Details |
|---|---|
| **Auth** | 🔒 `authenticate` + `authorize('superadmin')` |

**URL Params:** `userId` — target admin's userId

**Success Response (200):**
```json
{
  "success": true,
  "message": "Admin sessions fetched",
  "data": {
    "userId": "admin1",
    "name": "Admin One",
    "sessions": [ { "sessionId": "...", "createdAt": "...", "lastActivity": "...", "ipAddress": "...", "userAgent": "..." } ]
  }
}
```

---

#### 1.16 `PATCH /admins/:userId/status` — Update Admin Status 🔑 **Superadmin Only**

| | Details |
|---|---|
| **Auth** | 🔒 `authenticate` + `authorize('superadmin')` |

**URL Params:** `userId` — target admin's userId

**Request Body:**
```json
{
  "status": "active | inactive | suspended"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Status updated",
  "data": { "userId": "admin1", "status": "suspended" }
}
```

**Side Effects:** If not `active`, all sessions destroyed. Email notification sent. Cannot modify a superadmin.

---

### 2. Customer Routes (Admin)

**Mount:** `/api/v1/admin/customers`

#### 2.1 `GET /` — List All Customers 🔑 **Admin / Superadmin**

| | Details |
|---|---|
| **Auth** | 🔒 `authenticate` + `authorize('admin', 'superadmin')` |

**Query Params:**

| Param | Type | Default | Description |
|---|---|---|---|
| `page` | number | `1` | Page number |
| `limit` | number | `20` | Items per page (max 100) |
| `search` | string | — | Search by name, email, or phone |
| `status` | string | — | `active` \| `inactive` \| `blocked` |
| `businessType` | string | — | `b2b` \| `d2c` \| `both` |
| `sortBy` | string | `createdAt` | `createdAt` \| `lastActive` |
| `sortOrder` | string | `desc` | `asc` \| `desc` |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Customers fetched",
  "data": {
    "customers": [ { "phone": "...", "profile": {...}, "status": "active", ... } ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

#### 2.2 `GET /admin/:id` — Get Customer Detail 🔑 **Admin / Superadmin**

| | Details |
|---|---|
| **Auth** | 🔒 `authenticate` + `authorize('admin', 'superadmin')` |

**URL Params:** `id` — Customer ObjectId

**Success Response (200):**
```json
{
  "success": true,
  "message": "Customer fetched",
  "data": {
    "customer": {
      "_id": "...",
      "phone": "...",
      "profile": { "name": "...", "email": "...", "company": "...", "businessType": "b2b", "address": {...}, "gstNumber": "..." },
      "activityLog": [...],
      "preferences": { "interestedProducts": [...] },
      "status": "active",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

---

#### 2.3 `PATCH /admin/:id/status` — Update Customer Status 🔑 **Admin / Superadmin**

| | Details |
|---|---|
| **Auth** | 🔒 `authenticate` + `authorize('admin', 'superadmin')` |

**Request Body:**
```json
{ "status": "active | inactive | blocked" }
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Customer status updated",
  "data": { "customerId": "...", "phone": "...", "status": "blocked" }
}
```

---

#### 2.4 `PATCH /:id/update` — Update Customer Details 🔑 **Admin / Superadmin**

| | Details |
|---|---|
| **Auth** | 🔒 `authenticate` + `authorize('admin', 'superadmin')` |

**Request Body:**
```json
{
  "profile": {
    "name": "string (optional)",
    "email": "string (optional, validated)",
    "company": "string (optional)",
    "businessType": "b2b | d2c | both (optional)",
    "gstNumber": "string (optional, Indian GST format validated)",
    "address": {
      "street": "string (optional)",
      "city": "string (optional)",
      "state": "string (optional)",
      "country": "string (optional)",
      "pincode": "string (optional)"
    }
  }
}
```

**Success Response (200):**
```json
{ "success": true, "message": "Customer details updated successfully", "data": { "customer": {...} } }
```

---

### 3. Product Routes

**Mount:** `/api/v1/products`

#### 3.1 `POST /` — Create Product 🔑 **Admin / Superadmin**

| | Details |
|---|---|
| **Auth** | 🔒 `authenticate` + `authorize('admin', 'superadmin')` |
| **Audit** | `auditMiddleware('create', 'product')` |

**Request Body:**
```json
{
  "name": "string (required)",
  "slug": "string (required, unique)",
  "category": "brick | sheet | tile | panel (required)",
  "description": { "short": "string (required, max 200)", "long": "string (required)" },
  "story": "string (required)",
  "stance": "string (required)",
  "variants": [
    {
      "design": "string", "material": "string", "article": "string",
      "images": { "withBacklit": [{ "url": "...", "alt": "...", "order": 1 }], "withoutBacklit": [...] },
      "pricing": { "unit": "sqft|sqm|piece|sheet", "pricePerUnit": 100, "currency": "INR", "bulkDiscounts": [{ "minQuantity": 100, "discountPercentage": 5 }] },
      "specifications": { "dimensions": { "length": 0, "width": 0, "thickness": 0, "unit": "mm|cm|inch" }, "weight": { "value": 0, "unit": "kg" }, "finish": "string", "sustainability": { "ecoRating": 0, "certifications": [], "recycledContent": 0 } },
      "availability": { "inStock": true, "stockQuantity": 100, "productionTimeline": "string" },
      "sku": "string (unique, required)"
    }
  ],
  "tags": ["string"],
  "seo": { "metaTitle": "string", "metaDescription": "string", "keywords": ["string"] }
}
```

**Success Response (201):**
```json
{ "success": true, "message": "Product created successfully", "data": { "product": {...} } }
```

---

#### 3.2 `PATCH /:id` — Update Product 🔑 **Admin / Superadmin**

| | Details |
|---|---|
| **Auth** | 🔒 `authenticate` + `authorize('admin', 'superadmin')` |
| **Audit** | `auditMiddleware('update', 'product')` |

**Request Body:** Any subset of the create product fields.

**Success Response (200):**
```json
{ "success": true, "message": "Product updated successfully", "data": { "product": {...} } }
```

---

#### 3.3 `PATCH /:id/status` — Update Product Status 🔑 **Admin / Superadmin**

| | Details |
|---|---|
| **Auth** | 🔒 `authenticate` + `authorize('admin', 'superadmin')` |
| **Audit** | `auditMiddleware('status_change', 'product')` |

**Request Body:**
```json
{ "status": "active | inactive | discontinued" }
```

---

#### 3.4 `DELETE /:id` — Delete Product 🔑 **Superadmin Only**

| | Details |
|---|---|
| **Auth** | 🔒 `authenticate` + `authorize('superadmin')` |
| **Audit** | `auditMiddleware('delete', 'product')` |

**Success Response (200):**
```json
{ "success": true, "message": "Product deleted successfully", "data": null }
```

---

#### 3.5 `GET /id/:id` — Get Product by ID 🔑 **Admin / Superadmin**

| | Details |
|---|---|
| **Auth** | 🔒 `authenticate` + `authorize('admin', 'superadmin')` |

**Success Response (200):**
```json
{ "success": true, "message": "Product fetched", "data": { "product": {...} } }
```

---

### 4. Ticket Routes (Admin)

**Mount:** `/api/v1/admin/tickets`

#### 4.1 `GET /admin` — Get Admin Tickets 🔑 **Admin / Superadmin**

| | Details |
|---|---|
| **Auth** | 🔒 `authenticate` + `authorize('admin', 'superadmin')` |

**Query Params:**

| Param | Type | Default | Description |
|---|---|---|---|
| `page` | number | `1` | Page |
| `limit` | number | `20` | Limit |
| `status` | string | — | Filter by status |
| `priority` | string | — | Filter by priority |
| `type` | string | — | Filter by ticket type |
| `assigned` | string | — | `me` \| `unassigned` \| `others` |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "ticketId": "TKT-202603-000001",
        "type": "support",
        "subject": "...",
        "priority": "high",
        "status": "open",
        "customer": { "phone": "...", "profile": { "name": "...", "company": "..." } },
        "assignedTo": { "userId": "...", "profile": { "name": "..." } },
        "productInterest": [...]
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 50, "totalPages": 3 }
  }
}
```

> **Note:** Regular admins only see tickets assigned to them or unassigned. Superadmins see all.

---

#### 4.2 `GET /:ticketId` — Get Single Ticket

| | Details |
|---|---|
| **Auth** | 🔓 Public (but role-checked inside controller) |

**Success Response (200):** Full ticket with populated customer, assignedTo, productInterest, and messages.

---

#### 4.3 `POST /:ticketId/messages` — Add Message to Ticket

| | Details |
|---|---|
| **Auth** | Mixed (no strict middleware auth — sender determined by body) |
| **Audit** | `auditMiddleware('ticket_action', 'ticket')` |

**Request Body:**
```json
{
  "message": "string (required)",
  "sender": "customer | admin | rag",
  "senderId": "string (ObjectId or userId/phone — auto-resolved)",
  "senderModel": "User | Customer"
}
```

**Side Effects:**
- Auto status transition: `awaiting_customer` → `awaiting_staff` (customer reply) or `awaiting_staff` → `awaiting_customer` (admin reply)
- WhatsApp + Email notification to customer on admin messages

---

#### 4.4 `PATCH /:ticketId/assign` — Assign Ticket 🔑 **Admin / Superadmin**

| | Details |
|---|---|
| **Auth** | 🔒 `authenticate` + `authorize('admin', 'superadmin')` |
| **Audit** | `auditMiddleware('assignment', 'ticket')` |

**Request Body:**
```json
{ "adminId": "ObjectId (optional — defaults to self)" }
```

**Side Effects:** Ticket status → `in_progress`. WhatsApp + Email notification to assigned admin.

---

#### 4.5 `PATCH /:ticketId/status` — Update Ticket Status 🔑 **Admin / Superadmin**

| | Details |
|---|---|
| **Auth** | 🔒 `authenticate` + `authorize('admin', 'superadmin')` |
| **Audit** | `auditMiddleware('status_change', 'ticket')` |

**Request Body:**
```json
{
  "status": "open | in_progress | awaiting_customer | awaiting_staff | resolved | closed",
  "resolutionNotes": "string (optional, for resolved/closed)"
}
```

**Side Effects:** On `resolved`/`closed`, WhatsApp + Email sent to customer with resolution notes.

---

### 5. Audit Routes

**Mount:** `/api/v1/admin/audits`

> **All audit routes require 🔑 Superadmin access.**

#### 5.1 `GET /` — Get All Audits

**Query Params:**

| Param | Type | Default |
|---|---|---|
| `page` | number | `1` |
| `limit` | number | `50` |
| `action` | string | — |
| `resource` | string | — |
| `userId` | string | — |
| `startDate` | string | — |
| `endDate` | string | — |

---

#### 5.2 `GET /user/:userId` — Get Audits for Specific User

**URL Params:** `userId` — admin userId string

**Query Params:** Same as 5.1 (except `userId`)

**Success Response (200):**
```json
{
  "data": {
    "user": { "userId": "admin1", "name": "Admin One", "role": "admin" },
    "audits": [...],
    "pagination": {...}
  }
}
```

---

#### 5.3 `GET /resource/:resource/:resourceId` — Get Audits for Specific Resource

**URL Params:** `resource` (e.g. `product`, `ticket`), `resourceId` (ObjectId)

---

## Customer / Public Routes

---

### 6. Customer Self-Serve Routes

**Mount:** `/api/v1/admin/customers` (shared router)

#### 6.1 `POST /register` — Register Customer (Send OTP)

| | Details |
|---|---|
| **Auth** | 🔓 Public |

**Request Body:**
```json
{ "phone": "string (required)" }
```

**Success Response (201):**
```json
{ "success": true, "message": "OTP sent successfully", "data": { "phone": "+919999999999", "message": "OTP sent to your WhatsApp" } }
```

---

#### 6.2 `POST /verify-otp` — Verify Customer OTP

| | Details |
|---|---|
| **Auth** | 🔓 Public |

**Request Body:**
```json
{ "phone": "string (required)", "otp": "string (required, 6 digits)" }
```

**Success Response (200):**
```json
{ "success": true, "message": "Phone verified successfully", "data": { "customerId": "...", "phone": "...", "isVerified": true } }
```

---

#### 6.3 `GET /:id` — Get Own Profile

**Success Response (200):** Full customer object with populated `preferences.interestedProducts`.

---

#### 6.4 `PATCH /:id/profile` — Update Own Profile

**Request Body:**
```json
{
  "name": "string (optional)",
  "email": "string (optional)",
  "company": "string (optional)",
  "businessType": "b2b | d2c (optional)",
  "address": { "street": "...", "city": "...", "state": "...", "country": "...", "pincode": "..." },
  "gstNumber": "string (optional)"
}
```

---

### 7. Product Public Routes

**Mount:** `/api/v1/products`

#### 7.1 `GET /` — Get All Products (Paginated)

| | Details |
|---|---|
| **Auth** | 🔓 Public |

**Query Params:**

| Param | Type | Default |
|---|---|---|
| `page` | number | `1` |
| `limit` | number | `20` |
| `category` | string | — |
| `status` | string | `active` |
| `search` | string | — (full-text search) |
| `sortBy` | string | `createdAt` |
| `order` | string | `desc` |

**Success Response (200):**
```json
{
  "data": {
    "products": [ { "name": "...", "slug": "...", "category": "brick", "description": { "short": "..." }, "variants": [...], "status": "active", "analytics": {...} } ],
    "pagination": { "page": 1, "limit": 20, "total": 45, "pages": 3 }
  }
}
```

---

#### 7.2 `GET /:slug` — Get Product by Slug

| | Details |
|---|---|
| **Auth** | 🔓 Public |

**Side Effects:** Increments `analytics.views` counter.

**Success Response (200):** Full product with populated `createdBy` and `updatedBy`.

---

### 8. Ticket Customer Routes

**Mount:** `/api/v1/admin/tickets`

#### 8.1 `POST /` — Create Ticket (Customer)

| | Details |
|---|---|
| **Auth** | 🔓 Public (requires `customerId` in body) |

**Request Body:**
```json
{
  "customerId": "ObjectId (required)",
  "type": "sales | support | inquiry | complaint",
  "businessType": "b2b | d2c",
  "subject": "string (required)",
  "message": "string (required — first message)",
  "priority": "low | medium | high | urgent (default: medium)",
  "productInterest": [{ "productId": "ObjectId", "variantSku": "string", "quantity": 0, "notes": "string" }]
}
```

**Success Response (201):** Full ticket object.

---

#### 8.2 `GET /customer/:customerId` — Get Customer's Tickets

**Query Params:** `page`, `limit`, `status`

---

#### 8.3 `PATCH /:ticketId/close` — Close Own Ticket (Customer)

**Request Body:**
```json
{ "customerId": "ObjectId (required)" }
```

---

## Portal Routes (Customer Portal)

> **Base path:** `/api/v1/portal`
> **Authentication:** JWT Bearer via `requireCustomerAuth` middleware (sets `req.customer`)

---

### 9. Portal Auth Routes

#### 9.1 `POST /auth/request-otp` — Request OTP (Login or Signup Detection)

| | Details |
|---|---|
| **Auth** | 🔓 Public |
| **Rate Limit** | `authLimiter` |

**Request Body:**
```json
{ "phone": "string (required, 7-15 digits)" }
```

**Success Response (200):**
```json
{
  "data": { "phone": "+919999999999", "flow": "login" },
  "message": "OTP sent to your WhatsApp"
}
```
_or_
```json
{
  "data": { "phone": "+919999999999", "flow": "signup" },
  "message": "Phone not registered. Please provide your details to sign up."
}
```

> If `flow === "login"`, OTP is sent immediately via WhatsApp. If `flow === "signup"`, frontend should collect name + email first, then call `/auth/signup`.

---

#### 9.2 `POST /auth/signup` — Register New Customer + Send OTP

| | Details |
|---|---|
| **Auth** | 🔓 Public |
| **Rate Limit** | `authLimiter` |

**Request Body:**
```json
{
  "phone": "string (required)",
  "name": "string (required)",
  "email": "string (required, valid email)"
}
```

**Success Response (201):**
```json
{ "data": { "phone": "...", "flow": "signup" }, "message": "OTP sent to your WhatsApp. Please verify to complete signup." }
```

**Error:** `409` if phone or email already exists and is verified.

---

#### 9.3 `POST /auth/verify-otp` — Verify OTP (Login or Signup)

| | Details |
|---|---|
| **Auth** | 🔓 Public |
| **Rate Limit** | `otpLimiter` (3 req / 1 hr) |

**Request Body:**
```json
{ "phone": "string (required)", "otp": "string (required)" }
```

**Success Response (200):**
```json
{
  "message": "Verified successfully. You are now logged in.",
  "data": {
    "customer": {
      "id": "ObjectId",
      "phone": "...",
      "name": "...",
      "email": "...",
      "isPhoneVerified": true,
      "businessType": "d2c"
    },
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi...",
    "sessionId": "uuid",
    "expiresIn": "30d"
  }
}
```

---

#### 9.4 `POST /auth/logout` — Portal Logout 🔒

| | Details |
|---|---|
| **Auth** | 🔒 `requireCustomerAuth` |

**Success Response (200):**
```json
{ "success": true, "message": "Logged out successfully", "data": null }
```

---

### 10. Portal Ticket Routes

> All require 🔒 `requireCustomerAuth`

#### 10.1 `POST /tickets` — Create Ticket

**Request Body:**
```json
{
  "type": "sales | support | inquiry | complaint (required)",
  "businessType": "b2b | d2c (required)",
  "subject": "string (required, min 5 chars)",
  "message": "string (required, min 10 chars)",
  "priority": "low | medium | high | urgent (default: medium)",
  "productInterest": [{ "productId": "ObjectId", "variantSku": "string", "quantity": 0, "notes": "string" }]
}
```

**Success Response (201):**
```json
{
  "data": {
    "ticketId": "TKT-202603-000001",
    "status": "open",
    "priority": "medium",
    "subject": "...",
    "type": "support",
    "businessType": "d2c",
    "createdAt": "..."
  }
}
```

**Side Effects:** WhatsApp + Email confirmation to customer. Activity logged.

---

#### 10.2 `GET /tickets` — List My Tickets (Paginated)

**Query Params:** `page` (default 1), `limit` (default 10, max 50), `status` (optional)

**Success Response (200):**
```json
{
  "data": {
    "tickets": [
      {
        "ticketId": "...", "type": "...", "subject": "...", "priority": "...", "status": "...",
        "unreadCount": 2,
        "latestMessage": { "sender": "admin", "message": "...", "timestamp": "..." },
        "createdAt": "..."
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 5, "totalPages": 1, "hasNext": false, "hasPrev": false }
  }
}
```

---

#### 10.3 `GET /tickets/:ticketId` — Get Full Ticket Detail

**Side Effects:** Auto-marks all admin/rag messages as `isRead: true`.

**Success Response (200):** Full ticket with complete message thread, populated `assignedTo` and `productInterest.productId`.

---

#### 10.4 `POST /tickets/:ticketId/messages` — Reply to Ticket

**Request Body:**
```json
{ "message": "string (required, max 5000 chars)" }
```

**Success Response (200):**
```json
{
  "data": {
    "ticketId": "...",
    "status": "awaiting_staff",
    "message": { "sender": "customer", "message": "...", "timestamp": "..." }
  }
}
```

**Side Effects:** Auto-transition `awaiting_customer` → `awaiting_staff`.

---

#### 10.5 `PATCH /tickets/:ticketId/close` — Close Own Ticket

**Success Response (200):**
```json
{ "data": { "ticketId": "...", "status": "closed" }, "message": "Ticket closed successfully" }
```

**Side Effects:** WhatsApp + Email notification. Ownership enforced.

---

## Rate Limiting

| Limiter | Window | Max Requests | Scope |
|---|---|---|---|
| `apiLimiter` | 15 min (configurable) | 1,000,000 (configurable) | All `/api/*` routes |
| `authLimiter` | 15 min | 15 (skips successful) | Login, forgot-password, reset-password, portal auth |
| `otpLimiter` | 1 hour | 3 per phone/email/IP | OTP verification endpoints |

---

## Error Handling

The global error handler (`errorHandler.js`) catches and normalises:

| Error Type | HTTP Code | Response |
|---|---|---|
| Mongoose `ValidationError` | `400` | Field-level error array |
| Mongoose `CastError` | `400` | "Invalid ID format" |
| Duplicate Key (`11000`) | `409` | "`{field}` already exists" |
| `JsonWebTokenError` | `401` | "Invalid token" |
| `TokenExpiredError` | `401` | "Token expired" |
| Unknown | `500` | Generic message in production |

---

## Audit Logging

Every significant admin action is logged to the `Audit` collection:

- **Actions tracked:** `create`, `update`, `delete`, `login`, `logout`, `logout_all`, `login_failed`, `login_blocked`, `verify_email`, `verify_phone`, `change_password`, `forgot_password`, `reset_password`, `update_admin_status`, `assignment`, `status_change`, `ticket_action`, `list_customers`, `view_customer`, `update_customer_status`, `update_customer_details`, `update_profile`, `product_view`, `read`
- **Stored metadata:** IP address, user agent, HTTP method, path, status code
- **Change tracking:** Before/after snapshots for update operations
- **Retention:** 90-day TTL (automatically cleaned up via MongoDB TTL index)

---

## Notifications

Notifications are sent via the **HSNS microservice** (`hsns.weinix.com`):

| Event | WhatsApp | Email |
|---|---|---|
| Admin login | ✅ | ✅ |
| Failed login attempt | — | ✅ |
| Admin registration (OTP) | ✅ | ✅ |
| Password change | ✅ | ✅ |
| Password reset | ✅ | ✅ |
| Admin status change | — | ✅ |
| Logout | — | ✅ |
| Customer OTP (portal) | ✅ | — |
| Ticket created | ✅ | ✅ |
| Ticket message (admin → customer) | ✅ | ✅ |
| Ticket resolved/closed | ✅ | ✅ |
| Ticket assigned (to admin) | ✅ | ✅ |
| Customer ticket closed (self) | ✅ | ✅ |

---

## Scripts

| Script | Path | Description |
|---|---|---|
| Seed Superadmin | `scripts/seedSuperAdmin.js` | Creates the initial superadmin using env vars |

---

## License

ISC © Vansh Khatri
]]>
