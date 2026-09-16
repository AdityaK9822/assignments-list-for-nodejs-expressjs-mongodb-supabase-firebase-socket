const admin = require('firebase-admin');
const { getDb } = require('../config/firebase');

const COLLECTION_NAME = 'users';

const createUser = async (userData) => {
  const db = getDb();
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const user = {
    userId,
    ...userData,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await db.collection(COLLECTION_NAME).doc(userId).set(user);
  return user;
};

const findUserByEmail = async (email) => {
  const db = getDb();
  const snapshot = await db.collection(COLLECTION_NAME).where('email', '==', email).get();
  
  if (snapshot.empty) {
    return null;
  }
  
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
};

const findUserById = async (userId) => {
  const db = getDb();
  const doc = await db.collection(COLLECTION_NAME).doc(userId).get();
  
  if (!doc.exists) {
    return null;
  }
  
  return { id: doc.id, ...doc.data() };
};

const updateUser = async (userId, updateData) => {
  const db = getDb();
  
  await db.collection(COLLECTION_NAME).doc(userId).update({
    ...updateData,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return await findUserById(userId);
};

const deleteUser = async (userId) => {
  const db = getDb();
  await db.collection(COLLECTION_NAME).doc(userId).delete();
  return true;
};

const getAllUsers = async () => {
  const db = getDb();
  const snapshot = await db.collection(COLLECTION_NAME).get();
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const updateUserRole = async (userId, role) => {
  const db = getDb();
  
  await db.collection(COLLECTION_NAME).doc(userId).update({
    role,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  return await findUserById(userId);
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  deleteUser,
  getAllUsers,
  updateUserRole,
};
