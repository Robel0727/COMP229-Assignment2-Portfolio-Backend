
import express from 'express';

import {
    createQualification,
    deleteQualification,
    getAllQualifications,
    getQualificationById,
    updateQualification
} from '../controllers/qualifications-controllers.js';

const router = express.Router();

router.get('/', getAllQualifications);
router.get('/:id', getQualificationById);
router.post('/', createQualification);
router.put('/:id', updateQualification);
router.delete('/:id', deleteQualification);

export default router;
