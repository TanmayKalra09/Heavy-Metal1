import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import 'dotenv/config';

export const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Check for the Authorization header and ensure it's valid
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // 2. If no token was extracted, return error immediately
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no token was provided.'
            });
        }

        // 3. Verify the token is valid and not expired
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Find the user from the database using the ID embedded in the token
        const user = await User.findById(decoded.id).select('-password');

        // 5. If no user is found for that ID, return error
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, the user for this token no longer exists.'
            });
        }

        // --- SUCCESS ---
        // 6. Attach the found user object to the request and proceed to the controller
        req.user = user;
        next();

    } catch (error) {
        // Handle JWT-specific errors with appropriate messages
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, invalid token.'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token has expired.'
            });
        }

        // Handle other errors (database errors, etc.)
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during authentication.'
        });
    }
};