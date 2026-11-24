import express from 'express';

import authMiddleware from '../middlewares/auth.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

import {
    createContact,
    deleteContact,
    getAllContacts,
    getContactById,
    updateContact
} from '../controllers/contacts-controllers.js';

const router = express.Router();

// Public route: Anyone can submit a contact message
router.post('/', createContact);

// Require authentication for all remaining routes
router.use(authMiddleware);

// READ: Administrator only
router.get('/', adminMiddleware, getAllContacts);
router.get('/:id', adminMiddleware, getContactById);

// UPDATE: Administrator only
router.put('/:id', adminMiddleware, updateContact);

// DELETE: Administrator only
router.delete('/:id', adminMiddleware, deleteContact);

export default router;