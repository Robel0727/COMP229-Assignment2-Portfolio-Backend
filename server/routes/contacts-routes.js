
import express from 'express';

import {
    createContact,
    deleteContact,
    getAllContacts,
    getContactById,
    updateContact
} from '../controllers/contacts-controllers.js';

const router = express.Router();

router.get('/', getAllContacts);
router.get('/:id', getContactById);
router.post('/', createContact);
router.put('/:id', updateContact);
router.delete('/:id', deleteContact);

export default router;
