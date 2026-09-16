# Restaurant Management API

A RESTful API built with Node.js, Express, and MongoDB for managing restaurants, menu items, and users.

## Features

- User authentication (register, login, profile)
- Restaurant management (CRUD operations)
- Menu item management (CRUD operations)
- Password hashing with bcrypt
- JWT-based authentication

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, Passport
- **Password Hashing**: bcryptjs

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```
MONGO_URI=mongodb://localhost:27017/restaurant_management
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
```

4. Start MongoDB:
```bash
brew services start mongodb-community
```

5. Start the server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `POST /api/restaurants` - Create restaurant (protected)
- `GET /api/restaurants/:id` - Get restaurant by ID
- `PUT /api/restaurants/:id` - Update restaurant (protected)
- `DELETE /api/restaurants/:id` - Delete restaurant (protected)

### Menu Items
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create menu item (protected)
- `GET /api/menu/:id` - Get menu item by ID
- `PUT /api/menu/:id` - Update menu item (protected)
- `DELETE /api/menu/:id` - Delete menu item (protected)

### Users
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

## Request/Response Examples

### Register User
**Request:**
```json
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "60d5f8a9b5e5e92f4c8e4b3a",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Create Restaurant
**Request:**
```json
POST /api/restaurants
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Tasty Bites",
  "city": "New York",
  "address": "123 Main St",
  "cuisine": "Italian",
  "rating": 4.5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "60d5f8a9b5e5e92f4c8e4b3b",
    "name": "Tasty Bites",
    "city": "New York",
    "address": "123 Main St",
    "cuisine": "Italian",
    "rating": 4.5,
    "createdAt": "2024-08-20T12:00:00.000Z"
  }
}
```

## Project Structure

```
Resturant management API/
├── .env
├── .gitignore
├── README.md
├── app.js
├── server.js
├── package.json
├── config/
│   ├── database.js
│   └── passport.js
├── models/
│   ├── Restaurant.js
│   ├── MenuItem.js
│   └── User.js
└── routes/
    └── api.routes.js
```

## License

ISC
