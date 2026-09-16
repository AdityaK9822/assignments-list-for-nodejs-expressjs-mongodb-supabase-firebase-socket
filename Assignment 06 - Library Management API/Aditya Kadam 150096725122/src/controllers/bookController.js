const admin = require('firebase-admin');
const {
  createBook,
  findBookById,
  getAllBooks,
  searchBooks,
  updateBook,
  deleteBook,
  updateBookStatus,
} = require('../models/bookModel');
const {
  createTransaction,
  findActiveTransactionByUserAndBook,
  getUserTransactions,
  returnBook,
} = require('../models/transactionModel');

const addBook = async (req, res, next) => {
  try {
    const { title, author, isbn, category, quantity } = req.body;
    
    const book = await createBook({
      title,
      author,
      isbn,
      category,
      quantity: quantity || 1,
      status: 'available',
    });
    
    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

const getBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const book = await findBookById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
        error: 'BOOK_NOT_FOUND',
      });
    }
    
    res.json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

const getBooks = async (req, res, next) => {
  try {
    const { status, category } = req.query;
    
    const filters = {};
    if (status) filters.status = status;
    if (category) filters.category = category;
    
    const books = await getAllBooks(filters);
    
    res.json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

const searchBooksController = async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required',
        error: 'SEARCH_TERM_REQUIRED',
      });
    }
    
    const books = await searchBooks(q);
    
    res.json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

const updateBookController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, author, isbn, category, quantity, status } = req.body;
    
    const existingBook = await findBookById(id);
    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
        error: 'BOOK_NOT_FOUND',
      });
    }
    
    const updateData = {};
    if (title) updateData.title = title;
    if (author) updateData.author = author;
    if (isbn) updateData.isbn = isbn;
    if (category) updateData.category = category;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (status) updateData.status = status;
    
    const updatedBook = await updateBook(id, updateData);
    
    res.json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBookController = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const book = await findBookById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
        error: 'BOOK_NOT_FOUND',
      });
    }
    
    await deleteBook(id);
    
    res.json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const borrowBook = async (req, res, next) => {
  try {
    const { id: bookId } = req.params;
    const userId = req.user.userId;
    
    const book = await findBookById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
        error: 'BOOK_NOT_FOUND',
      });
    }
    
    if (book.status === 'borrowed' && book.quantity === 0) {
      return res.status(400).json({
        success: false,
        message: 'Book is not available for borrowing',
        error: 'BOOK_NOT_AVAILABLE',
      });
    }
    
    const existingTransaction = await findActiveTransactionByUserAndBook(userId, bookId);
    if (existingTransaction) {
      return res.status(400).json({
        success: false,
        message: 'You have already borrowed this book',
        error: 'ALREADY_BORROWED',
      });
    }
    
    const borrowDays = parseInt(process.env.DEFAULT_BORROW_DAYS) || 14;
    const dueDate = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() + borrowDays * 24 * 60 * 60 * 1000)
    );
    
    const transaction = await createTransaction({
      userId,
      bookId,
      type: 'borrow',
      dueDate,
      bookTitle: book.title,
      userName: req.user.name,
    });
    
    await updateBookStatus(bookId, 'borrowed');
    
    res.status(201).json({
      success: true,
      message: 'Book borrowed successfully',
      data: {
        transaction,
        dueDate: dueDate.toDate(),
      },
    });
  } catch (error) {
    next(error);
  }
};

const returnBookController = async (req, res, next) => {
  try {
    const { id: bookId } = req.params;
    const userId = req.user.userId;
    
    const book = await findBookById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
        error: 'BOOK_NOT_FOUND',
      });
    }
    
    const transaction = await findActiveTransactionByUserAndBook(userId, bookId);
    if (!transaction) {
      return res.status(400).json({
        success: false,
        message: 'You have not borrowed this book',
        error: 'NOT_BORROWED',
      });
    }
    
    await returnBook(transaction.transactionId);
    await updateBookStatus(bookId, 'available');
    
    res.json({
      success: true,
      message: 'Book returned successfully',
    });
  } catch (error) {
    next(error);
  }
};

const getMyTransactions = async (req, res, next) => {
  try {
    const transactions = await getUserTransactions(req.user.userId);
    
    res.json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await getAllTransactions();
    
    res.json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
