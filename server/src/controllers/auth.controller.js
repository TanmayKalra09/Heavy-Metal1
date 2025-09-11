import User from '../models/User.model.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/jwt.js';
import 'dotenv/config';

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required'
            });
        }

        // Email format validation (basic)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Password strength validation
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // 1. Check if user already exists (case-insensitive)
        const userExists = await User.findOne({
            email: { $regex: new RegExp('^' + email + '$', 'i') }
        });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(12); // Increased salt rounds for better security
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create a new user in the database
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase(), // Store email in lowercase
            password: hashedPassword,
        });

        // 4. Generate token and send response
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                token: token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);

        // Handle MongoDB duplicate key error (in case the unique index catches it)
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Handle validation errors from Mongoose
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join('. ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error during registration. Please try again.'
        });
    }
};

// --- Controller for User Login ---
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // 1. Find the user by email (case-insensitive)
        const user = await User.findOne({
            email: { $regex: new RegExp('^' + email + '$', 'i') }
        });

        // 2. Check if user exists and password matches
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // 3. Generate token and send response
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                token: token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login. Please try again.'
        });
    }
};

// --- Controller for Token Verification ---
export const verifyToken = async (req, res) => {
    try {
        // User is already available from protect middleware
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during token verification'
        });
    }
};

// --- Controller for User Logout ---
export const logout = async (req, res) => {
    try {
        // In a stateless JWT system, logout is handled client-side
        // You could implement token blacklisting here if needed
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during logout'
        });
    }
};

// --- Controller for Getting User Profile ---
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching profile'
        });
    }
};

// --- Controller for Updating User Profile ---
export const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update email if provided
        if (email && email !== user.email) {
            // Check if email already exists
            const emailExists = await User.findOne({
                email: { $regex: new RegExp('^' + email + '$', 'i') },
                _id: { $ne: req.user.id }
            });

            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use'
                });
            }

            user.email = email.toLowerCase();
        }

        // Update name if provided
        if (name && name.trim() !== user.name) {
            user.name = name.trim();
        }

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating profile'
        });
    }
};