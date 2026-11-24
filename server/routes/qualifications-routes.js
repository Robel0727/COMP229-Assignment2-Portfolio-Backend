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

// Require authentication for all qualification routes
router.use(authMiddleware);

// READ: Available to authenticated users
router.get('/', getAllQualifications);
router.get('/:id', getQualificationById);

// CREATE: Administrator only
router.post('/', adminMiddleware, createQualification);

// UPDATE: Administrator only
router.put('/:id', adminMiddleware, updateQualification);

// DELETE: Administrator only
router.delete('/:id', adminMiddleware, deleteQualification);

export default router;