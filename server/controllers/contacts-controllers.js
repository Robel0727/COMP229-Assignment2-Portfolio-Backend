import ContactModel from '../models/contact-model.js';

// GET: Retrieve all contacts
export const getAllContacts = async (req, res) => {
    try {
        const contacts = await ContactModel.find();

        return res.status(200).json(contacts);
    } catch (error) {
        console.error('Get contacts error:', error.message);

        return res.status(500).json({
            message: 'Failed to retrieve contacts'
        });
    }
};

// GET: Retrieve one contact
export const getContactById = async (req, res) => {
    try {
        const contact = await ContactModel.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                message: 'Contact not found'
            });
        }

        return res.status(200).json(contact);
    } catch (error) {
        return res.status(400).json({
            message: 'Invalid contact ID'
        });
    }
};

// POST: Create a contact
export const createContact = async (req, res) => {
    try {
        const { firstName, lastName, phone, email, message } = req.body;

        if (
            typeof firstName !== 'string' || !firstName.trim() ||
            typeof lastName !== 'string' || !lastName.trim() ||
            typeof email !== 'string' ||
            !/^\S+@\S+\.\S+$/.test(email.trim()) ||
            typeof message !== 'string' || !message.trim()
        ) {
            return res.status(400).json({
                message: 'Valid first name, last name, email, and message are required'
            });
        }

        const contact = await ContactModel.create({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: typeof phone === 'string' ? phone.trim() : '',
            email: email.trim().toLowerCase(),
            message: message.trim()
        });

        return res.status(201).json({
            message: 'Contact submitted successfully',
            contact
        });

    } catch (error) {
        console.error('Create contact error:', error.message);

        return res.status(500).json({
            message: 'Failed to create contact'
        });
    }
};

// PUT: Update a contact
export const updateContact = async (req, res) => {
    try {
        const { firstName, lastName, phone, email, message } = req.body;

        const updates = {};

        if (firstName !== undefined) updates.firstName = firstName;
        if (lastName !== undefined) updates.lastName = lastName;
        if (phone !== undefined) updates.phone = phone;
        if (email !== undefined) updates.email = email;
        if (message !== undefined) updates.message = message;

        const contact = await ContactModel.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!contact) {
            return res.status(404).json({
                message: 'Contact not found'
            });
        }

        return res.status(200).json(contact);

    } catch (error) {
        return res.status(400).json({
            message: 'Failed to update contact'
        });
    }
};

// DELETE: Delete a contact
export const deleteContact = async (req, res) => {
    try {
        const contact = await ContactModel.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                message: 'Contact not found'
            });
        }

        return res.status(200).json({
            message: 'Contact deleted successfully'
        });

    } catch (error) {
        return res.status(400).json({
            message: 'Failed to delete contact'
        });
    }
};