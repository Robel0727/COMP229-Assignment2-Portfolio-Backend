
import mongoose from 'mongoose';
import UserModel from '../models/user-model.js';
import generateToken from '../utils/jwt.js';

// Return user information without the password
const safeUser = (user) => {
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

// GET: Retrieve all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find().select('-password');

        return res.status(200).json(users);
    } catch (error) {
        console.error('Get users error:', error.message);

        return res.status(500).json({
            message: 'Failed to retrieve users'
        });
    }
};

// GET: Retrieve one user by ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: 'Invalid user ID'
            });
        }

        const user = await UserModel.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Get user error:', error.message);

        return res.status(500).json({
            message: 'Failed to retrieve user'
        });
    }
};

// POST: Register a new user
export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (
            typeof name !== 'string' ||
            !name.trim() ||
            typeof email !== 'string' ||
            !email.trim() ||
            typeof password !== 'string' ||
            password.length < 8
        ) {
            return res.status(400).json({
                message: 'Name and email are required. Password must be at least 8 characters.'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await UserModel.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'An account with this email already exists'
            });
        }

        const newUser = new UserModel({
            name: name.trim(),
            email: normalizedEmail,
            password
        });

        const savedUser = await newUser.save();
        const token = generateToken(savedUser);

        return res.status(201).json({
            message: 'User registered successfully',
            user: safeUser(savedUser),
            token
        });
    } catch (error) {
        console.error('Register user error:', error.message);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: error.message
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                message: 'An account with this email already exists'
            });
        }

        return res.status(500).json({
            message: 'Failed to register user'
        });
    }
};

// PUT: Update a user by ID
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: 'Invalid user ID'
            });
        }

        if (
            !req.body ||
            Object.keys(req.body).length === 0
        ) {
            return res.status(400).json({
                message: 'Provide at least one field to update'
            });
        }

        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        if (name !== undefined) {
            if (typeof name !== 'string' || !name.trim()) {
                return res.status(400).json({
                    message: 'Name cannot be empty'
                });
            }

            user.name = name.trim();
        }

        if (email !== undefined) {
            if (
                typeof email !== 'string' ||
                !/^\S+@\S+\.\S+$/.test(email.trim())
            ) {
                return res.status(400).json({
                    message: 'Please provide a valid email address'
                });
            }

            user.email = email.trim().toLowerCase();
        }

        if (password !== undefined) {
            if (
                typeof password !== 'string' ||
                password.length < 8
            ) {
                return res.status(400).json({
                    message: 'Password must be at least 8 characters'
                });
            }

            // Saving the document triggers the password hashing hook
            user.password = password;
        }

        const updatedUser = await user.save();

        return res.status(200).json({
            message: 'User updated successfully',
            user: safeUser(updatedUser)
        });
    } catch (error) {
        console.error('Update user error:', error.message);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: error.message
            });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid user information'
            });
        }

        if (error.code === 11000) {
            return res.status(409).json({
                message: 'That email is already in use'
            });
        }

        return res.status(500).json({
            message: 'Failed to update user'
        });
    }
};

// DELETE: Delete a user by ID
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: 'Invalid user ID'
            });
        }

        const deletedUser = await UserModel.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        return res.status(200).json({
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error.message);

        return res.status(500).json({
            message: 'Failed to delete user'
        });
    }
};

// POST: Sign in an existing user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== 'string' ||
            !email.trim() ||
            typeof password !== 'string' ||
            !password
        ) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        // Explicitly select the password hash because the model
        // uses select: false for the password field
        const user = await UserModel.findOne({
            email: email.trim().toLowerCase()
        }).select('+password');

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const token = generateToken(user);

        return res.status(200).json({
            message: 'Login successful',
            user: safeUser(user),
            token
        });
    } catch (error) {
        console.error('Login error:', error.message);

        return res.status(500).json({
            message: 'Login failed due to a server error'
        });
    }
};
