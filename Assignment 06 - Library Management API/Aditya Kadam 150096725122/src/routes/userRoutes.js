const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const { validate } = require('../middleware/validator');
const {
  getUsers,
  getUser,
  updateUserRoleController,
  deleteUserController,
} = require('../controllers/userController');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware('librarian'), getUsers);

router.get('/:id', authMiddleware, roleMiddleware('librarian'), getUser);

router.put(
  '/:id/role',
  [
    authMiddleware,
    roleMiddleware('librarian'),
    body('role').isIn(['student', 'librarian']).withMessage('Invalid role'),
    validate,
  ],
  updateUserRoleController
);

router.delete('/:id', authMiddleware, roleMiddleware('librarian'), deleteUserController);

module.exports = router;
