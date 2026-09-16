const { getAllUsers, findUserById, updateUserRole, deleteUser } = require('../models/userModel');

const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    
    const usersResponse = users.map(user => {
      const userCopy = { ...user };
      delete userCopy.password;
      return userCopy;
    });
    
    res.json({
      success: true,
      count: usersResponse.length,
      data: usersResponse,
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND',
      });
    }
    
    const userResponse = { ...user };
    delete userResponse.password;
    
    res.json({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserRoleController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['student', 'librarian'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Role must be either "student" or "librarian"',
        error: 'INVALID_ROLE',
      });
    }
    
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND',
      });
    }
    
    if (user.userId === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role',
        error: 'CANNOT_CHANGE_OWN_ROLE',
      });
    }
    
    const updatedUser = await updateUserRole(id, role);
    
    const userResponse = { ...updatedUser };
    delete userResponse.password;
    
    res.json({
      success: true,
      message: 'User role updated successfully',
      data: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserController = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        error: 'USER_NOT_FOUND',
      });
    }
    
    if (user.userId === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
        error: 'CANNOT_DELETE_SELF',
      });
    }
    
    await deleteUser(id);
    
    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUserRoleController,
  deleteUserController,
};
