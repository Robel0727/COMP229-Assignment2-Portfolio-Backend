import express from 'express';
import authMiddleware from '../middlewares/auth.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

import {
    createQualification,
    deleteQualification,
    getAllQualifications,
    getQualificationById,
    updateQualification
} from '../controllers/qualifications-controllers.js';

const router = express.Router();

// READ: Public access
router.get('/', getAllQualifications);
router.get('/:id', getQualificationById);

// CREATE: Authentication and administrator authorization
router.post('/', authMiddleware, adminMiddleware, createQualification);

// UPDATE: Authentication and administrator authorization
router.put('/:id', authMiddleware, adminMiddleware, updateQualification);

// DELETE: Authentication and administrator authorization
router.delete('/:id', authMiddleware, adminMiddleware, deleteQualification);

export default router;