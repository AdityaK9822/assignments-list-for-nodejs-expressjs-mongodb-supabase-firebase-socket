# 🍽️ Assignment 03: Restaurant Management REST API with JWT
> **Track:** Backend Development | **Level:** Intermediate | **Estimated Time:** 6–8 Hours  
> **Tech Stack:** Node.js, Express.js, MongoDB Atlas, Mongoose, JWT (jsonwebtoken), bcryptjs, dotenv

---

## 📌 1. Objective & Overview

Develop a cloud-connected RESTful API for a Restaurant & Menu Ordering Management System using **MongoDB Atlas** and **JSON Web Tokens (JWT)**. Students will build relational document links with Mongoose (`ref` and `populate`), protect sensitive administrative routes using custom JWT Bearer middleware, and manage cloud environment configurations with `dotenv`.

### Key Learning Outcomes:
- Configuring and connecting to cloud-hosted databases (**MongoDB Atlas Cluster**).
- Stateless token-based authentication using **JWT** and secure password hashing with **bcryptjs**.
- Establishing parent-child document relationships between **Restaurants** and **Menu Items** (`ObjectId` references).
- Creating custom Bearer Token authentication middleware (`Authorization: Bearer <token>`).
- Implementing complex database sorting and limiting (e.g. Top 5 highest-rated restaurants).

---

## 🛠️ 2. Tech Stack & Dependencies

```bash
# Initialize project
npm init -y

# Install runtime dependencies
npm install express mongoose jsonwebtoken bcryptjs dotenv

# Install development dependencies
npm install -D nodemon
```

---

## 🗄️ 3. Database Schemas & Data Models

### 1. Restaurant Model (`models/Restaurant.js`)
```javascript
const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  cuisine: {
    type: String,
    required: [true, 'Cuisine type is required (e.g., Italian, Indian, Chinese)'],
    trim: true
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
```

### 2. Menu Item Model (`models/MenuItem.js`)
```javascript
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant ID reference is required']
  },
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
```

### 3. User Model (`models/User.js`)
```javascript
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
```

---

## 📋 4. Complete API Specification

### 🔐 Auth Endpoints (Public)

| Method | Endpoint | Description | Request Body Payload | Status Codes |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user, hash password | `{"username":"gordon","email":"gordon@chef.com","password":"michelinPassword"}` | `201 Created`<br>`400 Bad Request` |
| `POST` | `/api/auth/login` | Authenticate with email/password, returns JWT token | `{"email":"gordon@chef.com","password":"michelinPassword"}` | `200 OK`<br>`401 Unauthorized` |

### 🍽️ Restaurant Endpoints

| Method | Endpoint | Auth Required | Description | Request Body | Status Codes |
|---|---|:---:|---|---|---|
| `GET` | `/` | No | API Welcome Status | None | `200 OK` |
| `GET` | `/api/restaurants` | No | Fetch all restaurants | None | `200 OK` |
| `GET` | `/api/restaurants/top` | No | Fetch Top 5 restaurants sorted by rating descending | None | `200 OK` |
| `GET` | `/api/restaurants/:id` | No | Fetch a single restaurant by ID | None | `200 OK`<br>`404 Not Found` |
| `POST` | `/api/restaurants` | **Yes (JWT)** | Add a new restaurant | `{"name":"Olive Garden","city":"Mumbai","address":"Bandra West","cuisine":"Italian","rating":4.7}` | `201 Created`<br>`401 Unauthorized` |
| `PUT` | `/api/restaurants/:id` | **Yes (JWT)** | Update restaurant details | `{"rating":4.9}` | `200 OK`<br>`404 Not Found` |
| `DELETE` | `/api/restaurants/:id` | **Yes (JWT)** | Delete restaurant and its associated menu items | None | `200 OK`<br>`404 Not Found` |

### 🍕 Menu Item Endpoints

| Method | Endpoint | Auth Required | Description | Request Body | Status Codes |
|---|---|:---:|---|---|---|
| `GET` | `/api/restaurants/:id/menu` | No | Get all menu items for a specific restaurant | None | `200 OK`<br>`404 Not Found` |
| `POST` | `/api/restaurants/:id/menu` | **Yes (JWT)** | Add a menu item to a restaurant | `{"name":"Margherita Pizza","price":450,"isAvailable":true}` | `201 Created`<br>`401 Unauthorized` |
| `PUT` | `/api/menu/:id` | **Yes (JWT)** | Update menu item price/availability | `{"price":480,"isAvailable":false}` | `200 OK`<br>`404 Not Found` |
| `DELETE` | `/api/menu/:id` | **Yes (JWT)** | Remove a menu item by ID | None | `200 OK`<br>`404 Not Found` |

---

## 🔒 5. JWT Authentication Workflow & Middleware

1. **Client Registration/Login**: Client sends credentials to `/api/auth/login`.
2. **Token Generation**: Server validates credentials and signs a JWT:
   ```javascript
   const token = jwt.sign(
     { id: user._id, email: user.email },
     process.env.JWT_SECRET,
     { expiresIn: '24h' }
   );
   ```
3. **Protected Requests**: Client passes header:
   ```http
   Authorization: Bearer <jwt_token_string>
   ```
4. **JWT Verification Middleware (`middleware/auth.js`)**:
   ```javascript
   const jwt = require('jsonwebtoken');

   module.exports = (req, res, next) => {
     const authHeader = req.headers.authorization;
     if (!authHeader || !authHeader.startsWith('Bearer ')) {
       return res.status(401).json({ success: false, message: 'Access Denied: No token provided' });
     }

     const token = authHeader.split(' ')[1];
     try {
       const verified = jwt.verify(token, process.env.JWT_SECRET);
       req.user = verified;
       next();
     } catch (err) {
       return res.status(401).json({ success: false, message: 'Invalid or expired token' });
     }
   };
   ```

---

## 🏗️ 6. Project Architecture

```text
assignment-03-restaurant-api/
├── config/
│   └── db.js               # MongoDB Atlas connection
├── controllers/
│   ├── authController.js   # JWT Auth logic
│   ├── restaurantController.js # Restaurant CRUD + Top 5 filter
│   └── menuController.js   # Menu CRUD & restaurant relations
├── middleware/
│   ├── auth.js             # JWT verification middleware
│   └── logger.js           # Request logging middleware
├── models/
│   ├── MenuItem.js         # Menu schema with ref to Restaurant
│   ├── Restaurant.js       # Restaurant schema
│   └── User.js             # User credentials schema
├── routes/
│   ├── authRoutes.js
│   ├── menuRoutes.js
│   └── restaurantRoutes.js
├── .env.example            # PORT, MONGO_URI, JWT_SECRET
├── .gitignore
├── package.json
├── server.js
└── README.md
```

---

## 🧪 7. Testing & Verification Guide

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas) and copy the connection URI into `.env`.
2. Send `POST /api/auth/register` to create an admin account.
3. Send `POST /api/auth/login` to receive your JWT token.
4. Set the Bearer token in Postman's **Authorization** tab to test protected endpoints (`POST /api/restaurants`, `POST /api/restaurants/:id/menu`).
5. Verify `/api/restaurants/top` returns the top 5 highest rated restaurants.

---

## 📊 8. Grading Rubric (100 Marks)

| Evaluation Component | Marks |
|---|:---:|
| **MongoDB Atlas Connection & Data Modeling** (Parent-child restaurant-menu refs) | 25 |
| **JWT Authentication Flow & Middleware** (Token generation, verification, route protection) | 25 |
| **Restaurant & Menu CRUD Implementations** (Complete endpoints, cascading delete/checks) | 25 |
| **Top 5 Filtering & Query Logic** (Sorting, limiting, projection) | 10 |
| **Clean Architecture, Validation & Error Handling** (Status codes, .env usage) | 15 |
| **Total Marks** | **100** |

---

## 📤 9. Submission Instructions

- Submit your GitHub repository URL: `itm-assignment-03-restaurant-api`.
- Include a Postman export with sample requests demonstrating both public and token-protected endpoints.
