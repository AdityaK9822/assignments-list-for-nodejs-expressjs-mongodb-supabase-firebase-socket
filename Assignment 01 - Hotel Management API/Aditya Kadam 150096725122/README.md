# 🏨 Assignment 01: Hotel Management REST API
> **Track:** Backend Development | **Level:** Beginner | **Estimated Time:** 4–6 Hours  
> **Tech Stack:** Node.js, Express.js, In-Memory Data Storage, bcryptjs, Passport.js (Local Strategy), Express-Session

---

## 📌 1. Objective & Overview

Build a modular RESTful API service to manage hotel properties and handle user authentication using **Node.js** and **Express.js**. In this foundational assignment, you will learn how HTTP requests work, how to organize routing and controllers using in-memory arrays (without an external database), and how to secure user credentials using **bcryptjs** and **Passport.js** session-based authentication.

### Key Learning Outcomes:
- Understanding Express.js routing, request params (`req.params`), query strings (`req.query`), and body parsing (`req.body`).
- Implementing session-based authentication with `passport` and `passport-local`.
- Securely hashing passwords before saving them in storage.
- Building custom middleware for request logging and input validation.
- Structuring an Express application using standard MVC architecture.

---

## 🛠️ 2. Tech Stack & Dependencies

```bash
# Initialize Node.js project
npm init -y

# Install core runtime dependencies
npm install express bcryptjs passport passport-local express-session dotenv

# Install development dependencies
npm install -D nodemon
```

---

## 🗄️ 3. Data Models & Entities (In-Memory Data Store)

All data should be maintained inside in-memory arrays (`let hotels = []; let users = [];`) in a dedicated mock store or memory repository.

### 🏨 Hotel Entity
| Field | Type | Required | Description / Constraints |
|---|---|:---:|---|
| `id` | Number | Yes | Unique auto-incrementing identifier |
| `name` | String | Yes | Name of the hotel (Must be unique) |
| `location` | String | Yes | City or locality of the hotel |
| `rating` | Number | Yes | Decimal or integer rating from `1.0` to `5.0` |
| `pricePerNight` | Number | Yes | Room price per night (Positive integer/float) |
| `createdAt` | Date / String | No | Timestamp of hotel creation |

**Sample Hotel JSON:**
```json
{
  "id": 1,
  "name": "Grand Palace Hotel",
  "location": "Mumbai",
  "rating": 4.8,
  "pricePerNight": 4500,
  "createdAt": "2026-03-01T10:00:00.000Z"
}
```

### 👤 User Entity
| Field | Type | Required | Description / Constraints |
|---|---|:---:|---|
| `id` | Number | Yes | Unique auto-incrementing user ID |
| `username` | String | Yes | Unique username (min 3 chars) |
| `email` | String | Yes | Valid email address format |
| `password` | String | Yes | Hashed password string (via bcryptjs) |

---

## 📋 4. API Specification & Endpoints

### 🔐 Authentication Routes

| Method | Endpoint | Auth Required | Description | Request Body Example | Status Codes |
|---|---|:---:|---|---|---|
| `POST` | `/api/auth/register` | No | Register a new user with hashed password | `{"username":"john_doe","email":"john@example.com","password":"securePassword123"}` | `201 Created`<br>`400 Bad Request` |
| `POST` | `/api/auth/login` | No | Authenticate user using Passport Local Strategy | `{"username":"john_doe","password":"securePassword123"}` | `200 OK`<br>`401 Unauthorized` |
| `POST` | `/api/auth/logout` | Yes | Destroy current user session | None | `200 OK` |
| `GET` | `/api/auth/current-user` | Yes | Retrieve details of currently logged-in user | None | `200 OK`<br>`401 Unauthorized` |

### 🏨 Hotel Management Routes

| Method | Endpoint | Query Params | Description | Request Body Example | Status Codes |
|---|---|---|---|---|---|
| `GET` | `/` | None | Welcome banner route returning API status | None | `200 OK` |
| `GET` | `/api/hotels` | `?rating=5&location=Mumbai` | Fetch all hotels (supports filtering by rating and location) | None | `200 OK` |
| `GET` | `/api/hotels/:id` | None | Fetch a specific hotel by ID | None | `200 OK`<br>`404 Not Found` |
| `POST` | `/api/hotels` | None | Create a new hotel (Prevent duplicate names) | `{"name":"The Orchid","location":"Pune","rating":4.2,"pricePerNight":3200}` | `201 Created`<br>`400 Bad Request` |
| `PUT` | `/api/hotels/:id` | None | Update hotel details by ID | `{"rating":4.5,"pricePerNight":3500}` | `200 OK`<br>`404 Not Found` |
| `DELETE` | `/api/hotels/:id` | None | Delete a hotel by ID | None | `200 OK`<br>`404 Not Found` |

---

## 🏗️ 5. Recommended Project Folder Structure

```text
assignment-01-hotel-api/
├── config/
│   └── passport.js          # Passport Local strategy & serialization logic
├── controllers/
│   ├── authController.js    # Register, login, session handlers
│   └── hotelController.js   # CRUD & filter handlers for hotels
├── data/
│   └── memoryStore.js       # In-memory arrays for users & hotels
├── middleware/
│   ├── authMiddleware.js    # Ensure authenticated session middleware
│   ├── loggerMiddleware.js  # Request logger (Method, URL, Timestamp)
│   └── validation.js        # Validations for hotel & user fields
├── routes/
│   ├── authRoutes.js        # Auth route definitions
│   └── hotelRoutes.js       # Hotel route definitions
├── .env.example             # Example environment configuration
├── .gitignore               # node_modules, .env
├── package.json
├── server.js                # Express app bootstrap & middleware mounting
└── README.md
```

---

## ⚙️ 6. Step-by-Step Implementation Guide

1. **Step 1 - Express Setup & Middleware**:
   Configure Express with `express.json()` and `express.urlencoded({ extended: true })`. Setup `express-session` with a secret key.
2. **Step 2 - Passport Setup**:
   Configure `passport-local` strategy to verify `username` and compare password using `bcrypt.compare()`. Implement `passport.serializeUser` and `passport.deserializeUser`.
3. **Step 3 - Data Storage**:
   Create `data/memoryStore.js` pre-seeded with 3–5 initial hotel objects so testing is convenient.
4. **Step 4 - Hotel CRUD & Filtering**:
   - In `GET /api/hotels`, check if `req.query.rating` exists; if so, filter hotels where `hotel.rating >= parseFloat(req.query.rating)`.
   - In `POST /api/hotels`, check if a hotel with the same name already exists in the array (case-insensitive). Return `400` if duplicate.
5. **Step 5 - Logging Middleware**:
   Write a custom middleware function:
   ```javascript
   const requestLogger = (req, res, next) => {
     console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
     next();
   };
   ```

---

## 🧪 7. Testing & Verification

### Sample cURL Commands:

**1. Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"email\":\"admin@hotel.com\",\"password\":\"admin123\"}"
```

**2. Add New Hotel:**
```bash
curl -X POST http://localhost:5000/api/hotels \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Taj Lands End\",\"location\":\"Mumbai\",\"rating\":5.0,\"pricePerNight\":12000}"
```

**3. Filter Hotels by Rating:**
```bash
curl -X GET "http://localhost:5000/api/hotels?rating=4.5"
```

---

## 🌟 8. Extra Challenge Tasks (Bonus)

- **Pagination**: Support `?page=1&limit=5` in `GET /api/hotels`.
- **Search Query**: Support `?search=mumbai` to match substring in hotel name or location.
- **Price Range Filter**: Support `?minPrice=2000&maxPrice=5000`.

---

## 📊 9. Grading Rubric (100 Marks)

| Evaluation Criteria | Marks |
|---|:---:|
| **Hotel CRUD Operations & Validation** (Proper status codes, duplicate name check) | 30 |
| **User Authentication & Bcrypt Hashing** (Passport-Local setup, session handling) | 25 |
| **Query Filtering & Query Parameters** (Rating, location filter logic) | 15 |
| **Middleware Implementation** (Custom logger, auth guard) | 15 |
| **Code Organization & Documentation** (MVC structure, clean README) | 15 |
| **Total Marks** | **100** |

---

## 📤 10. Submission Guidelines

1. Push your code to a public GitHub repository named `itm-assignment-01-hotel-api`.
2. Include an exported **Postman Collection JSON** file in a `/postman` directory.
3. Submit the GitHub repository link to your instructor/LMS portal.
