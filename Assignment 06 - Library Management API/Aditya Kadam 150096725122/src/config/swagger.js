const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library Management API',
      version: '1.0.0',
      description: 'Complete Library Management System REST API with Node.js, Express.js, JWT Authentication, and Firebase Firestore',
      contact: {
        name: 'Aditya Kadam',
        email: '150096725122',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              description: 'User unique identifier',
            },
            name: {
              type: 'string',
              description: 'User full name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            role: {
              type: 'string',
              enum: ['student', 'librarian'],
              description: 'User role',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Book: {
          type: 'object',
          properties: {
            bookId: {
              type: 'string',
              description: 'Book unique identifier',
            },
            title: {
              type: 'string',
              description: 'Book title',
            },
            author: {
              type: 'string',
              description: 'Book author',
            },
            isbn: {
              type: 'string',
              description: 'Book ISBN number',
            },
            category: {
              type: 'string',
              description: 'Book category',
            },
            status: {
              type: 'string',
              enum: ['available', 'borrowed'],
              description: 'Book availability status',
            },
            quantity: {
              type: 'integer',
              description: 'Number of available copies',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            transactionId: {
              type: 'string',
              description: 'Transaction unique identifier',
            },
            userId: {
              type: 'string',
              description: 'User ID who borrowed the book',
            },
            bookId: {
              type: 'string',
              description: 'Book ID borrowed',
            },
            type: {
              type: 'string',
              enum: ['borrow', 'return'],
              description: 'Transaction type',
            },
            borrowDate: {
              type: 'string',
              format: 'date-time',
              description: 'Date borrowed',
            },
            returnDate: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Date returned',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Due date',
            },
            status: {
              type: 'string',
              enum: ['active', 'returned', 'overdue'],
              description: 'Transaction status',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
            },
            error: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerDocs;
