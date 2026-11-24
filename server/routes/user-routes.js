import express from 'express';

import authMiddleware from '../middlewares/auth.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

import {
    createUser,
    updateUser,
    deleteUser,
    getAllUsers,
    getUserById,
    loginUser
} from '../controllers/user-controllers.js';

const router = express.Router();

// PUBLIC: Register a new user
router.post('/', createUser);

// PUBLIC: Sign in
router.post('/login', loginUser);

// Require authentication for user-management routes
router.use(authMiddleware);

// READ: Administrator only
router.get('/', adminMiddleware, getAllUsers);
router.get('/:id', adminMiddleware, getUserById);

// UPDATE: Administrator only
router.put('/:id', adminMiddleware, updateUser);

// DELETE: Administrator only
router.delete('/:id', adminMiddleware, deleteUser);

export default router;