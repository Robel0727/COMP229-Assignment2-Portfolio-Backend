import express from 'express';
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

// CREATE: Administrator only
router.post('/', adminMiddleware, createQualification);

// UPDATE: Administrator only
router.put('/:id', adminMiddleware, updateQualification);

// DELETE: Administrator only
router.delete('/:id', adminMiddleware, deleteQualification);

export default router;