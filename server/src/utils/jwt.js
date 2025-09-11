import jwt from 'jsonwebtoken';
import 'dotenv/config';

/**
 * Generates a JSON Web Token (JWT) for a given user ID.
 * @param {string} id - The user's unique ID from the database.
 * @returns {string} The generated JWT.
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // The token will be valid for 30 days
    });
};

export default generateToken;