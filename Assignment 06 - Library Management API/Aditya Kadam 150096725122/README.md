# 📚 Assignment 06: Library Management API with Firebase, Rate Limiting & Swagger
> **Track:** Backend Development | **Level:** Intermediate to Advanced | **Estimated Time:** 7–9 Hours  
> **Tech Stack:** Node.js, Express.js, Firebase Admin SDK (Firestore & Auth), JWT, bcryptjs, express-rate-limit, swagger-ui-express

---

## 📌 1. Objective & Overview

Build a production-grade RESTful API for an institutional **Library Management System** integrating **Google Firebase Firestore** as the cloud document store, **JWT & bcrypt** for role-based authentication (`Student` vs `Librarian`), **API Rate Limiting** to guard against DoS/abuse attacks, and **Swagger (OpenAPI 3.0)** for automated interactive documentation.

### Key Learning Outcomes:
- Initializing and securing Firebase Admin SDK using service account credentials.
- Performing Firestore collection and document queries (`addDoc`, `getDocs`, `updateDoc`, sub-collections).
- Enforcing Role-Based Access Control (RBAC): Librarians can add/edit books; Students can browse and borrow/return books.
- Implementing API Rate Limiting using `express-rate-limit`.
- Documenting every endpoint with JSDoc annotations and serving a live UI via `swagger-ui-express`.

---

## 🛠️ 2. Tech Stack & Dependencies

```bash
# Initialize Node.js project
npm init -y

# Install dependencies
npm install express firebase-admin jsonwebtoken bcryptjs express-rate-limit swagger-ui-express swagger-jsdoc dotenv cors

# Install development tools
npm install -D nodemon
```

---

## 👥 3. User Roles & Permission Matrix

| Operation | Student | Librarian | Public |
|---|:---:|:---:|:---:|
| `POST /api/auth/register` (as Student) | ✅ | ❌ | ✅ |
| `POST /api/auth/register-librarian` (with Secret Key) | ❌ | ✅ | ✅ |
| `GET /api/books` (Browse catalog) | ✅ | ✅ | ✅ |
| `POST /api/books` (Add new book) | ❌ | ✅ | ❌ |
| `PUT /api/books/:id` (Update book details) | ❌ | ✅ | ❌ |
| `DELETE /api/books/:id` (Remove book) | ❌ | ✅ | ❌ |
| `POST /api/books/:id/borrow` | ✅ | ❌ | ❌ |
| `POST /api/books/:id/return` | ✅ | ❌ | ❌ |
| `GET /api/reports/overdue` | ❌ | ✅ | ❌ |

---

## 🗄️ 4. Firebase Firestore Schema Design

### 1. `users` Collection
```json
{
  "uid": "auto_generated_doc_id",
  "name": "Jane Smith",
  "email": "jane@university.edu",
  "password": "$2a$10$hashed_password...",
  "role": "student", // "student" or "librarian"
  "createdAt": "2026-03-01T12:00:00Z"
}
```

### 2. `books` Collection
```json
{
  "id": "book_doc_id_101",
  "title": "Introduction to Algorithms",
  "author": "Thomas H. Cormen",
  "isbn": "978-0262033848",
  "category": "Computer Science",
  "totalCopies": 10,
  "availableCopies": 7,
  "createdAt": "2026-03-01T12:00:00Z"
}
```

### 3. `borrow_records` Collection
```json
{
  "id": "borrow_doc_id_999",
  "userId": "user_doc_id",
  "bookId": "book_doc_id_101",
  "bookTitle": "Introduction to Algorithms",
  "borrowDate": "2026-03-01T14:00:00Z",
  "dueDate": "2026-03-15T14:00:00Z",
  "returnDate": null,
  "status": "borrowed" // "borrowed" or "returned"
}
```

---

## 📋 5. API Endpoints Specification

### 🔐 Authentication & Users

| Method | Endpoint | Access Level | Description |
|---|---|:---:|---|
| `POST` | `/api/auth/register` | Public | Register a new Student account |
| `POST` | `/api/auth/login` | Public | Login with email & password, returns JWT token with embedded role |
| `GET` | `/api/auth/profile` | Authenticated | Retrieve current user profile |

### 📖 Book Catalog & Inventory

| Method | Endpoint | Access Level | Description |
|---|---|:---:|---|
| `GET` | `/api/books` | Public | List books with search (`?search=algorithms`) & category filter |
| `GET` | `/api/books/:id` | Public | Get single book details & current availability |
| `POST` | `/api/books` | **Librarian Only** | Create a new book record |
| `PUT` | `/api/books/:id` | **Librarian Only** | Update book details or inventory copies |
| `DELETE` | `/api/books/:id` | **Librarian Only** | Remove book from catalog |

### 🔄 Borrow & Return System

| Method | Endpoint | Access Level | Description |
|---|---|:---:|---|
| `POST` | `/api/books/:id/borrow` | **Student Only** | Borrow a copy (Decrements `availableCopies`, creates borrow record) |
| `POST` | `/api/books/:id/return` | **Student Only** | Return borrowed book (Increments `availableCopies`, sets `returnDate`) |
| `GET` | `/api/books/my-history` | **Student Only** | View current user's borrowing history |
| `GET` | `/api/librarian/borrow-records` | **Librarian Only** | View all active and past borrow records |

### 📑 Swagger API Docs & Rate Limiting

| Method | Endpoint | Access Level | Description |
|---|---|:---:|---|
| `GET` | `/api-docs` | Public | Interactive Swagger UI API documentation |
| Global | All `/api/*` | Public | Rate limited to 100 requests per 15 minutes |

---

## 🛡️ 6. Rate Limiting & Swagger Setup

### Rate Limiter Configuration (`middleware/rateLimiter.js`):
```javascript
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per windowMs per IP
  message: {
    success: false,
    message: 'Too many requests created from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = apiLimiter;
```

### Swagger JSDoc Setup (`config/swagger.js`):
```javascript
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library Management API',
      version: '1.0.0',
      description: 'Documented with Swagger OpenAPI 3.0'
    },
    servers: [{ url: 'http://localhost:5000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

module.exports = swaggerJsdoc(options);
```

---

## 🏗️ 7. Recommended Directory Structure

```text
assignment-06-library-api/
├── config/
│   ├── firebaseConfig.js   # Firebase Admin SDK initialization
│   └── swagger.js          # Swagger JSDoc configuration
├── controllers/
│   ├── authController.js   # Registration, login & JWT generation
│   ├── bookController.js   # Book CRUD & inventory logic
│   └── borrowController.js # Borrow, return & history logic
├── middleware/
│   ├── auth.js             # JWT verification middleware
│   ├── checkRole.js        # RBAC middleware (verifyStudent, verifyLibrarian)
│   └── rateLimiter.js      # Express rate limiter configuration
├── routes/
│   ├── authRoutes.js       # Swagger-documented auth routes
│   ├── bookRoutes.js       # Swagger-documented book routes
│   └── borrowRoutes.js     # Swagger-documented borrow/return routes
├── serviceAccountKey.json  # Firebase service account (In .gitignore)
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

---

## 🧪 8. Verification & Testing

1. Place your `serviceAccountKey.json` from Firebase Console inside the root and configure `firebaseConfig.js`.
2. Start server and visit `http://localhost:5000/api-docs` to view Swagger UI.
3. Test RBAC: Ensure a user with role `student` receives `403 Forbidden` when attempting to call `POST /api/books`.
4. Test Borrow/Return logic: Confirm `availableCopies` decrements when borrowed and cannot drop below `0`.

---

## 📊 9. Grading Rubric (100 Marks)

| Evaluation Component | Marks |
|---|:---:|
| **Firebase Firestore Integration & Queries** (Data structure, transactions/atomic updates) | 25 |
| **Role-Based Access Control (RBAC)** (Student vs Librarian permissions) | 20 |
| **Borrow & Return Business Logic** (Availability validation, due date tracking) | 20 |
| **Swagger Documentation Coverage** (Interactive UI with schema documentation) | 15 |
| **Rate Limiting & Security Hardening** (express-rate-limit, bcrypt, error handlers) | 20 |
| **Total Marks** | **100** |

---

## 📤 10. Submission Guidelines

- Submit your GitHub repository: `itm-assignment-06-library-api`.
- Include a screenshot of your live **Swagger UI** (`/api-docs`) in the repository.
- Ensure `.gitignore` ignores `serviceAccountKey.json` and `.env`.
