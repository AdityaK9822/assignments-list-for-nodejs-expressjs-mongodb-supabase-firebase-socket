const admin = require('firebase-admin');
const { getDb } = require('../config/firebase');

const COLLECTION_NAME = 'transactions';

const createTransaction = async (transactionData) => {
  const db = getDb();
  const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const transaction = {
    transactionId,
    ...transactionData,
    borrowDate: admin.firestore.FieldValue.serverTimestamp(),
    returnDate: null,
    status: 'active',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await db.collection(COLLECTION_NAME).doc(transactionId).set(transaction);
  return transaction;
};

const findTransactionById = async (transactionId) => {
  const db = getDb();
  const doc = await db.collection(COLLECTION_NAME).doc(transactionId).get();
  
  if (!doc.exists) {
    return null;
  }
  
  return { id: doc.id, ...doc.data() };
};

const findActiveTransactionByUserAndBook = async (userId, bookId) => {
  const db = getDb();
  const snapshot = await db.collection(COLLECTION_NAME)
    .where('userId', '==', userId)
    .where('bookId', '==', bookId)
    .where('status', '==', 'active')
    .get();
  
  if (snapshot.empty) {
    return null;
  }
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

const getUserTransactions = async (userId) => {
  const db = getDb();
  const snapshot = await db.collection(COLLECTION_NAME)
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getAllTransactions = async () => {
  const db = getDb();
  const snapshot = await db.collection(COLLECTION_NAME)
    .orderBy('createdAt', 'desc')
    .get();
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const updateTransaction = async (transactionId, updateData) => {
  const db = getDb();
  
  await db.collection(COLLECTION_NAME).doc(transactionId).update({
    ...updateData,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return await findTransactionById(transactionId);
};

const returnBook = async (transactionId) => {
  const db = getDb();
  
  await db.collection(COLLECTION_NAME).doc(transactionId).update({
    returnDate: admin.firestore.FieldValue.serverTimestamp(),
    status: 'returned',
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return await findTransactionById(transactionId);
};

const checkOverdueTransactions = async () => {
  const db = getDb();
  const now = admin.firestore.Timestamp.now();
  
  const snapshot = await db.collection(COLLECTION_NAME)
    .where('status', '==', 'active')
    .where('dueDate', '<', now)
    .get();
  
  const batch = db.batch();
  snapshot.docs.forEach(doc => {
    batch.update(doc.ref, { status: 'overdue' });
  });
  
  await batch.commit();
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

module.exports = {
  createTransaction,
  findTransactionById,
  findActiveTransactionByUserAndBook,
  getUserTransactions,
  getAllTransactions,
  updateTransaction,
  returnBook,
  checkOverdueTransactions,
};
