const express = require('express');
const { body, query, param } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const { validate } = require('../middleware/validator');
const {
  addBook,
  getBook,
  getBooks,
  searchBooksController,
  updateBookController,
  deleteBookController,
  borrowBook,
  returnBookController,
  getMyTransactions,
  getAllTransactions,
} = require('../controllers/bookController');

const router = express.Router();

/**
 * @swagger
 * /api/books/search:
 *   get:
 *     summary: Search books by title or author
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search term
 *     responses:
 *       200:
 *         description: Search results
 *       400:
 *         description: Search term required
 */
router.get('/search', searchBooksController);

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [available, borrowed]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of books
 */
router.get('/', getBooks);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Add a new book (Librarian only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               isbn:
 *                 type: string
 *               category:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Book added successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  [
    authMiddleware,
    roleMiddleware('librarian'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('author').trim().notEmpty().withMessage('Author is required'),
    body('isbn').optional().trim(),
    body('category').optional().trim(),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    validate,
  ],
  addBook
);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get book details
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book details
 *       404:
 *         description: Book not found
 */
router.get('/:id', getBook);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update book details (Librarian only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               isbn:
 *                 type: string
 *               category:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [available, borrowed]
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Book not found
 */
router.put(
  '/:id',
  [
    authMiddleware,
    roleMiddleware('librarian'),
    body('title').optional().trim().notEmpty(),
    body('author').optional().trim().notEmpty(),
    body('quantity').optional().isInt({ min: 0 }),
    body('status').optional().isIn(['available', 'borrowed']),
    validate,
  ],
  updateBookController
);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book (Librarian only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Book not found
 */
router.delete('/:id', authMiddleware, roleMiddleware('librarian'), deleteBookController);

/**
 * @swagger
 * /api/books/{id}/borrow:
 *   post:
 *     summary: Borrow a book (Student only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Book borrowed successfully
 *       400:
 *         description: Book not available or already borrowed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 */
router.post('/:id/borrow', authMiddleware, roleMiddleware('student'), borrowBook);

/**
 * @swagger
 * /api/books/{id}/return:
 *   post:
 *     summary: Return a borrowed book (Student only)
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       400:
 *         description: Book not borrowed by user
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 */
router.post('/:id/return', authMiddleware, roleMiddleware('student'), returnBookController);

/**
 * @swagger
 * /api/transactions/my:
 *   get:
 *     summary: Get user's transaction history
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's transaction history
 *       401:
 *         description: Unauthorized
 */
router.get('/transactions/my', authMiddleware, getMyTransactions);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions (Librarian only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All transactions
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/transactions', authMiddleware, roleMiddleware('librarian'), getAllTransactions);

module.exports = router;
