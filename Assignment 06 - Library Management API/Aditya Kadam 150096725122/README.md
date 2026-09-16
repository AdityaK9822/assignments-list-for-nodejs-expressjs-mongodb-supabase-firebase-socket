# 📚 Library Management API

Complete REST API for Library Management System using Node.js, Express.js, JWT Authentication, and Firebase Firestore.

**Student:** Aditya Kadam  
**Student ID:** 150096725122  
**Assignment:** 6

## 🌐 Live Demo

**Base URL:** https://assignment-6-library-management-api-f678.onrender.com

- 📖 API Documentation (Swagger): https://assignment-6-library-management-api-f678.onrender.com/api-docs
- 🏥 Health Check: https://assignment-6-library-management-api-f678.onrender.com/health

> Hosted on Render's free tier — the first request after a period of inactivity may take ~30–50 seconds while the service wakes up.

## 📌 Overview

This is a complete Library Management System REST API that provides:

- 🔐 JWT-based Authentication with bcrypt password hashing
- 👥 Role-based Access Control (Student & Librarian)
- 📚 Complete Book Management (CRUD operations)
- 🔄 Borrow/Return System with transaction tracking
- 🚦 Rate Limiting for API security
- 📊 Swagger/OpenAPI Documentation
- 🛡️ Custom middleware (Auth, Role, Logger, Validator)

## 🛠️ Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Firebase Firestore** - NoSQL database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Swagger/OpenAPI** - API documentation
- **express-rate-limit** - Rate limiting
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing

## 📁 Project Structure

```
library-management-api/
├── server.js                    # Main server file
├── package.json                 # Dependencies
├── .env                         # Environment variables
├── .env.example                 # Environment variables template
├── src/
│   ├── config/
│   │   ├── firebase.js          # Firebase configuration
│   │   └── swagger.js           # Swagger configuration
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── role.js              # Role checker
│   │   ├── logger.js            # Request logger
│   │   ├── rateLimiter.js       # Rate limiting
│   │   ├── validator.js         # Input validation
│   │   └── errorHandler.js      # Global error handler
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── bookRoutes.js        # Book endpoints
│   │   └── userRoutes.js        # User management
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── bookController.js    # Book logic
│   │   └── userController.js    # User logic
│   ├── models/
│   │   ├── userModel.js         # User operations
│   │   ├── bookModel.js         # Book operations
│   │   └── transactionModel.js  # Transaction operations
│   └── utils/                   # Utility functions
└── README.md                    # Documentation
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js >= 14.x
- npm or yarn
- Firebase project with Firestore enabled

### Installation

1. **Clone or download the project**

```bash
cd "Aditya Kadam 150096725122 Assignment 6"
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Copy `.env.example` to `.env` and update with your Firebase credentials:

```bash
cp .env.example .env
```

4. **Update Firebase credentials**

Edit `.env` file with your Firebase Admin SDK credentials:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`
- Other Firebase configuration variables

5. **Start the server**

```bash
# Production mode
npm start

# Development mode (with nodemon)
npm run dev
```

6. **Access the API**

- API Base URL: `http://localhost:3000`
- Swagger Documentation: `http://localhost:3000/api-docs`
- Health Check: `http://localhost:3000/health`

## 🔑 Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Go to Project Settings > Service Accounts
4. Generate new private key
5. Extract the following values and add to `.env`:
   - `project_id`
   - `private_key_id`
   - `private_key`
   - `client_email`
   - `client_id`

## 📊 API Endpoints

### 🔹 Authentication Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/auth/profile` | Get user profile | ✅ |
| PUT | `/api/auth/profile` | Update profile | ✅ |

### 🔹 Book Routes

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/books` | Get all books | ❌ | - |
| GET | `/api/books/search` | Search books | ❌ | - |
| GET | `/api/books/:id` | Get book details | ❌ | - |
| POST | `/api/books` | Add new book | ✅ | Librarian |
| PUT | `/api/books/:id` | Update book | ✅ | Librarian |
| DELETE | `/api/books/:id` | Delete book | ✅ | Librarian |
| POST | `/api/books/:id/borrow` | Borrow book | ✅ | Student |
| POST | `/api/books/:id/return` | Return book | ✅ | Student |

### 🔹 Transaction Routes

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/transactions/my` | User's transactions | ✅ | - |
| GET | `/api/transactions` | All transactions | ✅ | Librarian |

### 🔹 User Management Routes

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/users` | Get all users | ✅ | Librarian |
| GET | `/api/users/:id` | Get user details | ✅ | Librarian |
| PUT | `/api/users/:id/role` | Update user role | ✅ | Librarian |
| DELETE | `/api/users/:id` | Delete user | ✅ | Librarian |

## 👥 User Roles & Permissions

### Student
- ✅ View all books
- ✅ Search books
- ✅ Borrow books
- ✅ Return books
- ✅ View own transaction history
- ✅ Update own profile

### Librarian
- ✅ All Student permissions
- ✅ Add new books
- ✅ Update book details
- ✅ Delete books
- ✅ View all users
- ✅ Update user roles
- ✅ Delete users
- ✅ View all transactions

## 🗄️ Database Schema

### Users Collection
```javascript
{
  userId: "string",
  name: "string",
  email: "string (unique)",
  password: "string (hashed)",
  role: "student" | "librarian",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

### Books Collection
```javascript
{
  bookId: "string",
  title: "string",
  author: "string",
  isbn: "string",
  category: "string",
  status: "available" | "borrowed",
  quantity: "number",
  createdAt: "timestamp"
}
```

### Transactions Collection
```javascript
{
  transactionId: "string",
  userId: "string",
  bookId: "string",
  type: "borrow" | "return",
  borrowDate: "timestamp",
  returnDate: "timestamp (null if not returned)",
  dueDate: "timestamp",
  status: "active" | "returned" | "overdue"
}
```

## 🛡️ Middleware Features

### Auth Middleware
- JWT token verification
- User extraction from token
- Invalid/expired token handling

### Role Middleware
- Role-based access control
- Permission verification
- Forbidden access handling

### Logger Middleware
- Request logging (method, URL, timestamp)
- User tracking
- Response time measurement

### Rate Limiter
- 100 requests per 15 minutes (configurable)
- IP-based limiting
- Rate limit headers

### Validator Middleware
- Request body validation
- Query parameter validation
- Custom error messages

### Error Handler
- Global error handling
- Proper HTTP status codes
- Development/Production mode error details

## 📖 API Testing

### Using Swagger UI
1. Navigate to `http://localhost:3000/api-docs`
2. Click on "Authorize" button
3. Enter JWT token: `Bearer <your_token>`
4. Test endpoints directly from UI

### Using Postman/Insomnia

1. **Register a user**
```bash
POST http://localhost:3000/api/auth/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

2. **Login**
```bash
POST http://localhost:3000/api/auth/login
Body: {
  "email": "john@example.com",
  "password": "password123"
}
# Copy the token from response
```

3. **Access protected routes**
```bash
GET http://localhost:3000/api/auth/profile
Headers: {
  "Authorization": "Bearer <your_token>"
}
```

## 🔒 Security Features

- ✅ JWT Authentication
- ✅ bcrypt Password Hashing
- ✅ Helmet Security Headers
- ✅ CORS Configuration
- ✅ Rate Limiting
- ✅ Input Validation
- ✅ Role-based Access Control
- ✅ Error Handling

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 3000 |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRES_IN | JWT expiry time | 7d |
| FIREBASE_PROJECT_ID | Firebase project ID | - |
| FIREBASE_PRIVATE_KEY | Firebase private key | - |
| FIREBASE_CLIENT_EMAIL | Firebase client email | - |
| RATE_LIMIT_WINDOW_MS | Rate limit window (ms) | 900000 |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100 |
| DEFAULT_BORROW_DAYS | Default borrowing period | 14 |

## 🧪 Testing

Test all endpoints using:
- **Swagger UI** at `/api-docs`
- **Postman**
- **Insomnia**
- **Curl**

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [JWT Introduction](https://jwt.io/introduction)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- [Swagger Documentation](https://swagger.io/docs/)
- [bcrypt npm](https://www.npmjs.com/package/bcrypt)

## 🐛 Troubleshooting

### Common Issues

1. **Firebase initialization error**
   - Check all Firebase credentials in `.env`
   - Ensure private key is properly formatted with `\n` line breaks

2. **JWT invalid/expired**
   - Re-login to get a new token
   - Check JWT_SECRET in `.env`

3. **Rate limit exceeded**
   - Wait for the rate limit window to reset (15 minutes)
   - Adjust `RATE_LIMIT_MAX_REQUESTS` in `.env`

## 📄 License

MIT License

## 👨‍💻 Author

**Aditya Kadam**  
Student ID: 150096725122  
Assignment 6: Library Management API

---

**🎯 Built with ❤️ for learning purposes!**
