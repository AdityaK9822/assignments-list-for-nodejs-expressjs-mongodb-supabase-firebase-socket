const admin = require('firebase-admin');
const { getDb } = require('../config/firebase');

const COLLECTION_NAME = 'books';

const createBook = async (bookData) => {
  const db = getDb();
  const bookId = `book_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const book = {
    bookId,
    ...bookData,
    status: bookData.status || 'available',
    quantity: bookData.quantity || 1,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await db.collection(COLLECTION_NAME).doc(bookId).set(book);
  return book;
};

const findBookById = async (bookId) => {
  const db = getDb();
  const doc = await db.collection(COLLECTION_NAME).doc(bookId).get();
  
  if (!doc.exists) {
    return null;
  }
  
  return { id: doc.id, ...doc.data() };
};

const getAllBooks = async (filters = {}) => {
  const db = getDb();
  let query = db.collection(COLLECTION_NAME);
  
  if (filters.status) {
    query = query.where('status', '==', filters.status);
  }
  if (filters.category) {
    query = query.where('category', '==', filters.category);
  }
  
  const snapshot = await query.get();
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const searchBooks = async (searchTerm) => {
  const db = getDb();
  const snapshot = await db.collection(COLLECTION_NAME).get();
  
  const books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  const searchLower = searchTerm.toLowerCase();
  return books.filter(book => 
    book.title?.toLowerCase().includes(searchLower) ||
    book.author?.toLowerCase().includes(searchLower) ||
    book.isbn?.toLowerCase().includes(searchLower)
  );
};

const updateBook = async (bookId, updateData) => {
  const db = getDb();
  
  await db.collection(COLLECTION_NAME).doc(bookId).update({
    ...updateData,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return await findBookById(bookId);
};

const deleteBook = async (bookId) => {
  const db = getDb();
  await db.collection(COLLECTION_NAME).doc(bookId).delete();
  return true;
};

const updateBookStatus = async (bookId, status) => {
  const db = getDb();
  
  const book = await findBookById(bookId);
  if (!book) return null;
  
  const quantity = status === 'available' ? book.quantity + 1 : book.quantity - 1;
  
  await db.collection(COLLECTION_NAME).doc(bookId).update({
    status: quantity > 0 ? 'available' : 'borrowed',
    quantity: Math.max(0, quantity),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return await findBookById(bookId);
};

module.exports = {
  createBook,
  findBookById,
  getAllBooks,
  searchBooks,
  updateBook,
  deleteBook,
  updateBookStatus,
};
